# Build Stage
FROM node:19.6.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# Production Stage
FROM nginx AS final
WORKDIR /
COPY --from=build /app/out /var/www/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
