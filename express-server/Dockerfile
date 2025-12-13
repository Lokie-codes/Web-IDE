# ============================================
# Express Server - Optimized Multi-Stage Build
# ============================================

# Stage 1: Build stage with dependencies
FROM node:20-alpine AS builder

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev for potential build steps)
RUN npm ci

# Copy source code
COPY . .

# ============================================
# Stage 2: Production stage
# ============================================
FROM node:20-alpine AS production

# Install only runtime dependencies for native modules
RUN apk add --no-cache python3 make g++ \
  && rm -rf /var/cache/apk/*

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodeuser -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
  npm cache clean --force

# Copy application source
COPY --from=builder /app/src ./src

# Create data directory with proper permissions
RUN mkdir -p /app/data && \
  chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Expose application port
EXPOSE 3001

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
