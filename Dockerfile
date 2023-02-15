FROM node:lts-alpine as builder
RUN apk add --no-cache --virtual .build-deps python3 make gcc g++

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile
RUN yarn build


FROM node:lts-alpine as runner
RUN apk add --no-cache --virtual .build-deps python3 make gcc g++


WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist .
RUN apk del .build-deps


CMD [ "node", "src/main.js" ]