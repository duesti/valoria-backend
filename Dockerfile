# Build stage
FROM oven/bun:1 as builder

WORKDIR /app

# Copy files
COPY package.json ./
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json biome.json ./

# Install all dependencies (needed for build)
RUN bun install

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y dumb-init postgresql-client && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./

# Install production dependencies only
RUN bun install --production

# Copy prisma schema, migrations and seed script
COPY prisma ./prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3030

# Expose port
EXPOSE 3030

# Use dumb-init to properly handle signals
ENTRYPOINT ["dumb-init", "--"]

# Run migrations and seed, then start the server
CMD ["sh", "-c", "bun prisma migrate deploy && NODE_ENV=production bun prisma/seed.ts && bun run dist/index.js"]
