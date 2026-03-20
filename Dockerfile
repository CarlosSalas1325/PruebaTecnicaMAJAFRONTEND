# ---- Build stage ----
FROM node:20-alpine AS builder
ARG API_BASE_URL
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" src/environments/environment.ts
RUN npm run build

# ---- Production stage ----
FROM nginx:1.27-alpine
COPY --from=builder /app/dist/ptmaja-blog-web/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
