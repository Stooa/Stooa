# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

# BASE
FROM node:17.4 as base

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

WORKDIR /usr/app

COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json

RUN npm clean-install


# NEXT PROD
FROM base as next

RUN npm install --global pm2

COPY . /usr/app

CMD ["pm2-runtime", "start", "npx", "--interpreter", "bash", "--", "build-start"]


# NEXT DEV
FROM base as next-dev

CMD ["npx", "dev"]


# NGINX
FROM nginx:1.20 as nginx

COPY .docker/nginx-prod/default.conf.template /etc/nginx/templates/default.conf.template
