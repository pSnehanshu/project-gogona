#!/bin/sh

npx prisma migrate deploy
node backend/server.js
