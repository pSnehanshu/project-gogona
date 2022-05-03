#########################################
######## BUILD BACKEND ##################
#########################################

FROM node:16.15.0 as build
WORKDIR /home/app

COPY ./package*.json ./
COPY prisma prisma

RUN npm install
RUN npx prisma generate

COPY . .
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
COPY --from=build home/app/frontend/build frontend/build
COPY prisma prisma

COPY ./package*.json ./
RUN npm install --only=prod
RUN npm install prisma

COPY --from=build home/app/node_modules/.prisma node_modules/.prisma

COPY boot.sh boot.sh
RUN chmod +x ./boot.sh

EXPOSE 2343
CMD  [ "./boot.sh" ]
