# Étape 1 : Build
FROM node:22-alpine AS builder
WORKDIR /app

# Déclaration des arguments de build
ARG VITE_API_URL
ARG VITE_API_PASSWORD

# Injection pour Vite pendant le "npm run build"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_PASSWORD=$VITE_API_PASSWORD

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Étape 2 : Production Nginx
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]