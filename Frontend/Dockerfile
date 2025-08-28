# Frontend/Dockerfile
# Etapa 1: construir Angular
FROM node:20-alpine AS build
WORKDIR /app

# copiar package.json, instalar
COPY admin_planilla/package*.json ./
RUN npm ci

# copiar todo el proyecto Angular y construir
COPY admin_planilla/ ./
# Construir solo para navegador (no SSR) - comando corregido
RUN npm run build

# Etapa 2: servir con Nginx
FROM nginx:alpine

# copiar build (ruta corregida)
COPY --from=build /app/dist/admin_planilla/browser /usr/share/nginx/html

# copiar la configuración de nginx
COPY admin_planilla/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]