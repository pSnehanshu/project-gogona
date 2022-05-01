#########################################
######## BUILD BACKEND ##################
#########################################

FROM node:16.15.0 as build
WORKDIR /home/app

COPY ./package*.json ./
COPY prisma prisma

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx tsc

#########################################
######## BUILD FRONTEND #################
#########################################

WORKDIR /home/app/frontend

RUN npm install
RUN npm run build

#########################################
######## COMBINE AND RUN ################
#########################################

FROM node:16.15.0
WORKDIR /home/app

COPY --from=build home/app/backend/build ./
COPY --from=build home/app/package*.json ./
COPY --from=build home/app/frontend/build frontend/build

RUN npm install --only=prod

COPY --from=build home/app/node_modules/.prisma node_modules/.prisma

EXPOSE 2343
CMD  [ "node", "backend/server.js" ]
