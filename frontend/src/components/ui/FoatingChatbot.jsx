import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { aiChatbotService } from '../../services/aiChatbotService';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef(null);
  const sessionIdRef = useRef(Date.now().toString());

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    const userMsg = { id: Date.now(), text: currentInput, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiChatbotService.sendMessage(currentInput, sessionIdRef.current);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: response.reply || response.message || "I didn't quite understand that.", // assuming backend returns reply/message
        sender: 'bot' 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Sorry, I am having trouble connecting to the server.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-marginLarge right-marginLarge z-50 z-zIndexModal font-fontFamilyBody">
      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col mb-marginMedium w-80 sm:w-96 h-[500px] bg-surfaceColor border border-borderColor rounded-borderRadiusMd shadow-boxShadowHigh overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-secondaryColor p-paddingMedium border-b border-borderColor flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-successColor animate-pulse" />
              <h4 className="text-text-fontSizeSm font-fontWeightBold text-primaryColor tracking-letterSpacing uppercase">
                Takleeq AI
              </h4>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-textColorMuted hover:text-primaryColor transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-paddingMedium space-y-marginMedium scrollbar-thin"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-paddingSmall px-paddingMedium rounded-borderRadiusMd text-text-fontSizeSm ${
                    msg.sender === 'user' 
                      ? 'bg-primaryColor text-textColorInverse font-fontWeightMedium' 
                      : 'bg-borderColor text-textColorMain'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSend}
            className="p-paddingMedium border-t border-borderColor bg-secondaryColor flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-backgroundColor border border-borderColor rounded-borderRadiusSm px-paddingSmall text-textColorMain focus:outline-none focus:ring-1 focus:ring-primaryColor transition-all text-text-fontSizeSm"
            />
            <button 
              type="submit"
              className="bg-primaryColor text-textColorInverse p-paddingSmall rounded-borderRadiusSm hover:opacity-90 transition-opacity"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primaryColor text-textColorInverse p-paddingMedium rounded-borderRadiusFull shadow-boxShadowMedium hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          {isOpen ? <Minus size={28} /> : <MessageCircle size={28} />}
        </button>
      </div>
    </div>
  );
};

export default FloatingChatbot;