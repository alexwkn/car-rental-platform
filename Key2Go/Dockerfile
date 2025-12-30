# Expo (React Native) Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose Expo dev server ports
EXPOSE 8081 19000 19001 19002

# Start Expo in tunnel mode for accessibility
CMD ["npx", "expo", "start", "--tunnel"]
