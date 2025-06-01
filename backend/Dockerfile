#Declaring the base image
FROM node:23-alpine 

#Setting up the working directory inside the container
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copying package.json and package-lock.json to the working directory
COPY package*.json  ./

# Installing and caching dependencies
RUN mount=type=cache, target=/usr/src/app/.npm \
    && npm set cache /usr/src/app/.npm \
    && npm ci --only=production

USER node    

COPY --chown=node:node . .    

# Exposing the port on which the app will run
EXPOSE 3000

CMD [ "node" , "server.js" ]

