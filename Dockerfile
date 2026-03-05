FROM node:24-alpine
RUN apk upgrade --no-cache

WORKDIR /app

# Copy package files and install all deps (including dev for build)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build && npm prune --omit=dev

# Use the built-in non-root node user (UID/GID 1000)
RUN chown -R node:node /app

USER node

# Health check (uses Node 24 built-in fetch — no curl needed)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/health').then(r=>r.ok?process.exit(0):process.exit(1)).catch(()=>process.exit(1))"

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "build/server.js"]
