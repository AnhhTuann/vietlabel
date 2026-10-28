# Stage 1: Build frontend
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production server
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server source
COPY server.ts ./
COPY server/ ./server/
COPY --from=builder /app/src/data/ ./src/data/
COPY tsconfig.json ./

# Create private upload directory
RUN mkdir -p /app/data/uploads

EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/tsx server/db/migrate.ts && ./node_modules/.bin/tsx server.ts"]
