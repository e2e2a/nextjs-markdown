FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Next.js dev port
EXPOSE 3000

# This is where your 'npm run dev' lives
CMD ["npm", "run", "dev"]