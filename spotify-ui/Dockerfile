FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine

# Copy built app
COPY --from=build /app/dist/spotify-ui/browser /usr/share/nginx/html

# Custom nginx config for SPA + CORS
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # CORS headers for module federation \
    add_header Access-Control-Allow-Origin * always; \
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always; \
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept" always; \
    \
    # No cache for remoteEntry.json \
    location ~* remoteEntry\\.json$ { \
        add_header Cache-Control "no-cache, no-store, must-revalidate" always; \
        add_header Access-Control-Allow-Origin * always; \
    } \
    \
    # SPA fallback \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
