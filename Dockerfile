# Stage 1: Build Angular App
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .
COPY src/assets /app/src/assets

# Build Angular App (change project name if needed)
RUN npm run build -- --configuration production --output-path=dist/myinventory

# Stage 2: Serve with NGINX
FROM nginx:1.25-alpine

# Copy built app from builder stage
COPY --from=builder /app/dist/myinventory /usr/share/nginx/html

# Optional: Custom NGINX config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

