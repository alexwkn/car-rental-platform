# Build dependencies and Prisma client
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate

# Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN npm prune --omit=dev
EXPOSE 3001
CMD ["node", "entrypoint.js"]
