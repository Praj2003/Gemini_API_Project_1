# Dockerfile with multi-stage build 
FROM node:24-bullseye-slim AS build

# Setting up the working directory inside the container
WORKDIR /usr/src/app

# Declaring tghe environment variable for production
ENV NODE_ENV=production

# Copying package.json and package-lock.json to the working directory
COPY package*.json ./

# Installing and caching dependencies
RUN mount=type=cache, target=/usr/src/app/.npm \
    && npm set cache /usr/src/app/.npm \
    && npm ci --only=production


#Copying the rest of the application code to the working directory
COPY . .

# Here the dist folder is created, which contains the production-ready files
RUN npm run build

FROM  nginxinc/nginx-unprivileged:1.23-alpine-perl AS production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Start Nginx server



