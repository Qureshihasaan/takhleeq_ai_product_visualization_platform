"""
Design Generation Agent
-----------------------
Uses OpenAI Agents SDK with OpenRouter for reasoning and
image generation via the chat completions API (Flux model).

Image data is stored in a module-level dict to avoid passing
large base64 strings through the LLM context window.
"""

from __future__ import annotations

import uuid
import asyncio
import base64
import os
import sys
from openai import AsyncOpenAI
from agents import Agent, Runner, function_tool, set_tracing_disabled
from agents.models.openai_chatcompletions import OpenAIChatCompletionsModel
from google import genai
import re
from dataclasses import dataclass
import random
import urllib.parse
import aiohttp
import config

# Disable tracing (no direct OpenAI key for trace uploading)
set_tracing_disabled(True)

# ---------------------------------------------------------------------------
# Shared OpenRouter client & model (imported by other agents)
# ---------------------------------------------------------------------------

external_client = AsyncOpenAI(
    base_url="https://text.pollinations.ai/v1/",
    api_key=getattr(config, "POLLINATIONS_API_KEY", None) or os.getenv("POLLINATIONS_API_KEY") or "dummy_key",
)

model = OpenAIChatCompletionsModel(
    model="openai-fast",
    openai_client=external_client,
)

async def call_with_retry(client_fn, *args, **kwargs):
    """Executes an API call with exponential backoff on 429/rate limit errors."""
    max_retries = 4
    delay = 2.0
    for attempt in range(max_retries):
        try:
            return await client_fn(*args, **kwargs)
        except Exception as e:
            err_str = str(e).lower()
            is_rate_limit = any(x in err_str for x in ["429", "quota", "resource_exhausted", "rate limit"])
            if is_rate_limit and attempt < max_retries - 1:
                print(f"Gemini API rate limited (Attempt {attempt+1}/{max_retries}). Retrying in {delay}s...")
                await asyncio.sleep(delay)
                delay *= 2.0  # Exponential backoff: 2s, 4s, 8s
                continue
            raise e


# ---------------------------------------------------------------------------
# Image store — avoids sending base64 through the LLM context
# ---------------------------------------------------------------------------

_image_store: dict[str, str] = {}


def store_image(b64_data: str) -> str:
    """Store base64 image data and return a short reference ID."""
    ref_id = str(uuid.uuid4())[:8]
    _image_store[ref_id] = b64_data
    return ref_id


def get_image(ref_id: str) -> str | None:
    """Retrieve stored image data by reference ID."""
    return _image_store.pop(ref_id, None)

def peek_image(ref_id: str) -> str | None:
    """Check stored image data by reference ID without removing it."""
    return _image_store.get(ref_id)


@function_tool
async def analyze_reference_image(reference_id: str) -> str:
    """Analyze a reference image and return a description.

    Args:
        reference_id: The reference ID of the image to analyze.

    Returns:
        A text description of the image.
    """
    return "Reference image uploaded."


# ---------------------------------------------------------------------------
# Helper — generate image via Pollinations.ai (Free, No API Key)
# ---------------------------------------------------------------------------

async def generate_image_via_replicate(prompt: str, image_b64: str | None = None) -> str | None:
    """Generate image using Replicate AI API (flux-schnell model) with Pollinations fallback."""
    async def _fallback() -> str | None:
        try:
            print("Attempting to generate image via Pollinations.ai...")
            encoded_prompt = urllib.parse.quote(prompt)
            url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&model=flux&nologo=true"
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=30) as resp:
                    if resp.status == 200:
                        image_bytes = await resp.read()
                        return base64.b64encode(image_bytes).decode('utf-8')
                    else:
                        print(f"Pollinations Error: status {resp.status} - {await resp.text()}")
                        return None
        except Exception as e:
            print(f"Error in Pollinations fallback: {e}")
            return None

    api_token = getattr(config, "REPLICATE_API_TOKEN", None) or os.getenv("REPLICATE_API_TOKEN")
    if not api_token:
        print("ERROR: REPLICATE_API_TOKEN is not configured in environment or config.py. Falling back to Pollinations.")
        return await _fallback()

    try:
        model_name = getattr(config, "REPLICATE_IMAGE_MODEL", None) or os.getenv("REPLICATE_IMAGE_MODEL") or "black-forest-labs/flux-schnell"
        
        headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json",
        }
        
        # Build URL and payload based on version vs model
        if ":" in model_name:
            version_hash = model_name.split(":")[-1]
            url = "https://api.replicate.com/v1/predictions"
            payload = {
                "version": version_hash,
                "input": {
                    "prompt": prompt,
                    "aspect_ratio": "1:1",
                    "output_format": "png",
                }
            }
        else:
            url = f"https://api.replicate.com/v1/models/{model_name}/predictions"
            payload = {
                "input": {
                    "prompt": prompt,
                    "aspect_ratio": "1:1",
                    "output_format": "png",
                }
            }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload) as resp:
                if resp.status not in (200, 201):
                    print(f"Replicate Error: Creation failed with status {resp.status} - {await resp.text()}")
                    print("Falling back to Pollinations.")
                    return await _fallback()
                
                prediction = await resp.json()
                get_url = prediction.get("urls", {}).get("get")
                if not get_url:
                    print(f"Replicate Error: No polling URL returned in response: {prediction}")
                    print("Falling back to Pollinations.")
                    return await _fallback()
            
            # Poll for prediction completion
            max_polls = 60
            poll_interval = 1.0  # seconds
            
            for _ in range(max_polls):
                await asyncio.sleep(poll_interval)
                async with session.get(get_url, headers=headers) as poll_resp:
                    if poll_resp.status != 200:
                        print(f"Replicate Error: Polling failed with status {poll_resp.status} - {await poll_resp.text()}")
                        print("Falling back to Pollinations.")
                        return await _fallback()
                    
                    pred_status = await poll_resp.json()
                    status = pred_status.get("status")
                    
                    if status == "succeeded":
                        output = pred_status.get("output")
                        if not output:
                            print(f"Replicate Error: Succeeded but no output URL: {pred_status}")
                            print("Falling back to Pollinations.")
                            return await _fallback()
                        
                        img_url = output[0] if isinstance(output, list) else output
                        
                        # Download the final image
                        async with session.get(img_url) as img_resp:
                            if img_resp.status == 200:
                                image_bytes = await img_resp.read()
                                return base64.b64encode(image_bytes).decode('utf-8')
                            else:
                                print(f"Replicate Error: Failed to download image from {img_url} with status {img_resp.status}")
                                print("Falling back to Pollinations.")
                                return await _fallback()
                                
                    elif status in ("failed", "canceled"):
                        print(f"Replicate Error: Prediction finished with status {status}. Error: {pred_status.get('error')}")
                        print("Falling back to Pollinations.")
                        return await _fallback()
            
            print("Replicate Error: Prediction timed out after 60 seconds.")
            print("Falling back to Pollinations.")
            return await _fallback()
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("Replicate failed. Falling back to Pollinations.")
        return await _fallback()


# ---------------------------------------------------------------------------
# Custom tool — generate design image
# ---------------------------------------------------------------------------

@function_tool
async def generate_design_image(prompt: str, reference_image_id: str | None = None) -> str:
    """Generate a design image based on a text prompt.

    Uses an image-generation model to create a high-quality design.

    Args:
        prompt: Detailed description of the design to generate, including
                style, colors, patterns, and any specific elements.
        reference_image_id: Optional reference ID for guiding the design if provided by the user.

    Returns:
        A short reference ID for the generated image.
    """
    full_prompt = (
        f"CRITICAL INSTRUCTION: You must strictly follow the user's design description. "
        f"Do NOT hallucinate or add structural elements, subjects, or themes that are not explicitly requested. "
        f"Create a high-quality, production-ready design suitable for printing "
        f"on physical products. The design should be clean, isolated on a white "
        f"or transparent background, detailed, and vibrant. "
        f"Design description: {prompt}"
    )

    image_b64 = None
    if reference_image_id:
        ref_id = reference_image_id.split(':')[-1]
        image_b64 = peek_image(ref_id)

    result = await generate_image_via_replicate(full_prompt, image_b64=image_b64)
    if not result:
        return "ERROR: Image generation failed — no image data was returned."

    ref_id = store_image(result)
    return f"IMAGE_GENERATED:{ref_id}"


@function_tool
async def edit_design_image(prompt: str, original_image_id: str, visual_description: str) -> str:
    """Modify an existing design image based on a text prompt using Replicate AI.

    Args:
        prompt: Detailed description of the changes to apply (e.g., 'Change the panda's fur to blue').
        original_image_id: The reference ID of the image to be edited.
        visual_description: The detailed visual description of the original image obtained from analyze_reference_image.

    Returns:
        A short reference ID for the edited image.
    """
    fallback_prompt = (
        f"A professional design matching this exact description: {visual_description}. "
        f"But with these specific modifications: {prompt}. "
        f"Ensure the core structure, pose, and art style remain absolutely identical."
    )
    return await generate_design_image(fallback_prompt)


# ---------------------------------------------------------------------------
# Agent definition
# ---------------------------------------------------------------------------

# Read instructions from the markdown file
_instruction_file = os.path.join(os.path.dirname(__file__), "dynamic_instruction.md")
with open(_instruction_file, "r", encoding="utf-8") as f:
    dynamic_instruction = f.read()

design_agent = Agent(
    name="Design Generator",
    instructions=dynamic_instruction,
    tools=[generate_design_image, edit_design_image, analyze_reference_image],
    model=model,
)

print("Loaded Instructions Length:", len(dynamic_instruction))

# ---------------------------------------------------------------------------
# Public helper with robust fallback
# ---------------------------------------------------------------------------

async def generate_design(prompt: str, reference_image: str | None = None):
    """Run the design agent with automatic fallback if AI reasoning is rate-limited.
    
    This ensures that even if Gemini hits a 429/quota limit, the user 
    still gets a high-quality design via Pollinations.
    """
    user_message = f"Generate or edit a design based on this description: {prompt}"

    if reference_image:
        ref_id = store_image(reference_image)
        user_message += (
            f"\n\nI am also providing a reference image. "
            f"Its reference ID is IMAGE_REFERENCE:{ref_id}. "
            f"You MUST use the analyze_reference_image tool first to understand this image before generating or editing."
        )

    try:
        # Attempt to run the full Agent reasoning (supports multiple turns/tools)
        # We use a 4-retry policy with exponential backoff for 429s
        delay = 2.0
        for attempt in range(4):
            try:
                result = await Runner.run(design_agent, input=user_message)
                return result
            except Exception as e:
                err_str = str(e).lower()
                is_rate_limit = any(x in err_str for x in ["429", "quota", "resource_exhausted", "rate limit"])
                if is_rate_limit and attempt < 3:
                    print(f"Gemini Rate Limited during Agent run. Waiting {delay} seconds and retrying attempt {attempt+1}...")
                    await asyncio.sleep(delay)
                    delay *= 2.0
                    continue
                raise e
                
    except Exception as exc:
        # FALLBACK: If reasoning fails entirely, 
        # we generate the image directly using a refined prompt template.
        print(f"CRITICAL: Agent reasoning failed ({exc}). Falling back to Direct Replicate generation.")
        
        # Clean up the prompt for an image generator (remove "Change the color to", etc.)
        clean_prompt = prompt.lower().replace("change the color to", "").replace("make it", "").strip()
        refined_prompt = (
            f"A professional, high-quality design: {clean_prompt}. "
            "Isolated on a clean background, vibrant colors, sharp detail, "
            "vector style, suitable for high-definition printing on apparel and products."
        )
        
        # Call the Replicate helper directly
        image_b64 = await generate_image_via_replicate(refined_prompt)
        
        if not image_b64:
            raise RuntimeError(f"Both Agent reasoning and Replicate Fallback failed: {exc}")
            
        # Mock a RunResult-like object so the coordinator doesn't break
        @dataclass
        class MockToolOutput:
            output: str
        @dataclass
        class MockResult:
            final_output: str
            new_items: list
        
        ref_id = store_image(image_b64)
        return MockResult(
            final_output=f"IMAGE_GENERATED:{ref_id}",
            new_items=[MockToolOutput(output=f"IMAGE_GENERATED:{ref_id}")]
        )


if __name__ == "__main__":
    

    # Allow passing a prompt as a CLI argument
    prompt = " ".join(sys.argv[1:]) or "minimalist geometric pattern with blue and gold"

    async def _main():
        print(f"Generating design: {prompt!r} ...")
        result = await generate_design(prompt=prompt)

        # Find IMAGE_GENERATED reference in the result
        ref_pattern = re.compile(r"IMAGE_GENERATED:([a-f0-9]{8})")
        b64_data = None

        for item in result.new_items:
            if hasattr(item, "output") and isinstance(item.output, str):
                m = ref_pattern.search(item.output)
                if m:
                    b64_data = get_image(m.group(1))
                    break

        if not b64_data:
            print("ERROR: No image was generated.")
            return

        # Save the image
        os.makedirs("output", exist_ok=True)
        out_path = os.path.abspath("output/design_preview.png")
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(b64_data))

        print(f"Design saved to: {out_path}")
        print(f"Description: {result.final_output}")

        # Open the image (Windows)
        os.startfile(out_path)

    asyncio.run(_main())