# Etapa 1: compila o TypeScript para public/javascript
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY typescript/ ./typescript/
COPY public/ ./public/
RUN npm run build

# Etapa 2: serve os arquivos estáticos com nginx
FROM nginx:alpine
COPY --from=build /app/public/ /usr/share/nginx/html/
EXPOSE 80
