# Dockerfile
# Étape 1 : Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur web
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Supprimer la config par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Ajouter la nôtre (facultatif si tu veux gérer les routes SPA)
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
