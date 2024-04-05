ARG IMAGE_PLAYWRIGHT_FROM=mcr.microsoft.com/playwright
ARG IMAGE_PLAYWRIGHT_TAG=v1.42.1-focal

FROM node:20.11.1-alpine3.19 AS app
WORKDIR /src
COPY package.json package.json
COPY package-lock.json package-lock.json 
RUN npm install
COPY . .
RUN npm run build

FROM ${IMAGE_PLAYWRIGHT_FROM}:${IMAGE_PLAYWRIGHT_TAG} AS pw-server
WORKDIR /src
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm init -y
RUN npm install @playwright/test@1.42.1
COPY tests/core/remoteServer.js remoteServer.js
ENTRYPOINT [ "node", "remoteServer.js" ]

FROM ${IMAGE_PLAYWRIGHT_FROM}:${IMAGE_PLAYWRIGHT_TAG} AS pw-runner
WORKDIR /src
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV CI=true
COPY package.json package.json
COPY package-lock.json package-lock.json 
RUN npm install
COPY . .