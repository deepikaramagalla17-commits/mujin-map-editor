FROM debian:bullseye

RUN sed -i '/bullseye-security/d' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y curl ca-certificates xz-utils && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://nodejs.org/dist/v20.18.1/node-v20.18.1-linux-x64.tar.xz -o /tmp/node.tar.xz && \
    tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 && \
    rm /tmp/node.tar.xz

WORKDIR /app

COPY shared ./shared
COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend
RUN npm ci
RUN npm run build

WORKDIR /app/frontend
RUN rm -f package-lock.json && npm install
RUN npm run build

WORKDIR /app/backend
ENV NODE_ENV=production
ENV MAP_DATA_FILE=/app/backend/data/map.json
ENV FRONTEND_DIST_DIR=/app/frontend/dist
EXPOSE 3001

CMD ["node", "dist/backend/src/index.js"]
