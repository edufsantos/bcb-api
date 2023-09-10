FROM node:18.17.1 AS development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn prisma generate && yarn build

FROM 18.17.1 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn --prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

CMD ["yarn", "start:prod"]

