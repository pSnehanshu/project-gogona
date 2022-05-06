#########################################
######## BUILD FRONTEND #################
#########################################

FROM node:16.15-alpine as build
WORKDIR /home/app

COPY ./package*.json ./

RUN npm install

WORKDIR /home/app/frontend

COPY frontend/package*.json ./
COPY frontend .

RUN npm run build

#########################################
######## BUILD BACKEND ##################
#########################################
WORKDIR /home/app

COPY prisma prisma

RUN npm install; \
  npx prisma generate

COPY . .
RUN npx tsc

#########################################
######## COMBINE AND RUN ################
#########################################

FROM node:16.15-alpine
WORKDIR /home/app

COPY --from=build home/app/backend/build ./
COPY --from=build home/app/frontend/build frontend/build
COPY prisma prisma

COPY ./package*.json ./
RUN npm install --only=prod;\
  npm install prisma

COPY --from=build home/app/node_modules/.prisma node_modules/.prisma

COPY boot.sh boot.sh
RUN chmod +x ./boot.sh

EXPOSE 2343
CMD  [ "./boot.sh" ]
