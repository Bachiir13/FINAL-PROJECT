# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Construire l'app React
RUN npm run build

# Stage 2: Nginx pour servir l'app
FROM nginx:alpine

# Créer le dossier pour le certificat auto-signé
RUN mkdir -p /etc/nginx/certs

# Générer un certificat auto-signé pour localhost
RUN apk add --no-cache openssl \
    && openssl req -x509 -nodes -days 365 \
       -subj "/CN=localhost" \
       -newkey rsa:2048 \
       -keyout /etc/nginx/certs/server.key \
       -out /etc/nginx/certs/server.crt

# Copier le build React dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx HTTPS
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port HTTPS
EXPOSE 443

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
