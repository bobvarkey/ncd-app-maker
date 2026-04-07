FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better Docker cache)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY server.js ./
COPY middleware/ ./middleware/
COPY utils/ ./utils/
COPY models/ ./models/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
