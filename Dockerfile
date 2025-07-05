# 1. Base image with Node.js
FROM node:20-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the application
COPY . .

# 5. Build the app (assumes tsconfig.build.json exists)
RUN npm run build

# 6. Production image
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 7. Expose the port Railway will use
EXPOSE 3333

# 8. Start the app
CMD ["node", "dist/main.js"]
