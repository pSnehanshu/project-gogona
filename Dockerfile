#########################################
######## BUILD BACKEND ##################
#########################################

FROM node:16.15.0 as build-backend
WORKDIR /home/app

COPY ./package*.json ./
COPY prisma prisma

RUN ls
RUN ls prisma

RUN npm install

RUN ls node_modules
RUN ls node_modules/.prisma

COPY tsconfig.json .
COPY backend backend

RUN npx prisma generate
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

FROM node:16.15.0
WORKDIR /home/app

COPY --from=build-backend home/app/backend/build .
COPY --from=build-backend home/app/package*.json ./
COPY --from=build-frontend home/app/build frontend/build

RUN npm install --only=prod

COPY --from=build-backend home/app/node_modules/.prisma node_modules/.prisma

EXPOSE 2343
CMD  [ "node", "server.js" ]

