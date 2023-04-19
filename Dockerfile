FROM node:alpine AS builder
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN --mount=type=cache,target=/root/.yarn/cache yarn install
COPY craco.config.js tsconfig.json .env.defaults .env.example ./
COPY src src
COPY public public
ARG URL_BASE="."
RUN yarn build

FROM caddy:alpine
COPY --from=builder /app/build /srv