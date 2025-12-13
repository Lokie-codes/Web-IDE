# ============================================
# Frontend Client - Optimized Multi-Stage Build
# ============================================

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# ============================================
# Stage 2: Production stage with Nginx
# ============================================
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user (nginx already runs as nginx user)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Add custom nginx.conf for non-root if needed
RUN sed -i 's/listen       80;/listen       80;/g' /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]