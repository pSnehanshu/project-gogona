FROM node:16.15-alpine as build
WORKDIR /home/app

#########################################
######## BUILD BACKEND ##################
#########################################
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate && npx tsc

#########################################
######## BUILD FRONTEND #################
#########################################
WORKDIR /home/app/frontend
RUN npm run build

#########################################
######## COMBINE AND RUN ################
#########################################

FROM node:16.15-alpine
WORKDIR /home/app

COPY --from=build home/app/backend/build ./
COPY --from=build home/app/frontend/build frontend/build
COPY prisma prisma

COPY ./package*.json ./
RUN npm install --only=prod

COPY --from=build home/app/node_modules/.prisma node_modules/.prisma

COPY boot.sh boot.sh
RUN chmod +x ./boot.sh

EXPOSE 2343
CMD  [ "./boot.sh" ]
