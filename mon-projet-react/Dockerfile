# Stage 1: build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Construire l'app
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

# Créer un dossier pour le certificat auto-signé
RUN mkdir -p /etc/nginx/certs

# Générer un certificat auto-signé pour localhost
RUN apk add --no-cache openssl \
    && openssl req -x509 -nodes -days 365 \
       -subj "/CN=localhost" \
       -newkey rsa:2048 \
       -keyout /etc/nginx/certs/server.key \
       -out /etc/nginx/certs/server.crt

# Copier le build Vite vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la config Nginx HTTPS
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer port 443
EXPOSE 443

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
