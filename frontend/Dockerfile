# Use Node.js to run the Vite development server
FROM node:20-slim
WORKDIR /app

# Install dependencies first (for faster builds)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 5173

# Run Vite in host mode so Docker can see it
CMD ["npm", "run", "dev",  "--host"]