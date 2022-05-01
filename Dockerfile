#########################################
######## BUILD BACKEND ##################
#########################################

FROM node:16-slim as build-backend
WORKDIR /home/app

COPY ./package*.json ./
RUN npm install

COPY tsconfig.json .
COPY backend backend

RUN npx tsc

#########################################
######## BUILD FRONTEND #################
#########################################

FROM node:16-slim as build-frontend
WORKDIR /home/app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .

RUN npm run build

#########################################
######## COMBINE AND RUN ################
#########################################

FROM node:16-slim
WORKDIR /home/app

COPY --from=build-backend home/app/backend/build .
COPY --from=build-backend home/app/package*.json ./
COPY --from=build-frontend home/app/build frontend/build

RUN npm install --only=prod

EXPOSE 2343
CMD [ "node", "server.js" ]
