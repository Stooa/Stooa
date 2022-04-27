# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

# BASE
FROM node:17.4 as base

ARG UID=1000
ARG GID=1000

RUN usermod -u $UID node
RUN groupmod -g $GID node

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

WORKDIR /usr/app

COPY --chown=$UID:$GID package.json /usr/app/package.json
COPY --chown=$UID:$GID package-lock.json /usr/app/package-lock.json

RUN npm clean-install


# NEXT PROD
FROM base as next

RUN npm install --global pm2

COPY --chown=$UID:$GID . /usr/app

CMD ["pm2-runtime", "npm", "--", "run", "build-start"]


# NEXT DEV
FROM base as next-dev

CMD ["npm", "run", "dev"]


# NGINX
FROM nginx:1.21 as nginx

ARG UID=1000
ARG GID=1000

RUN usermod -u $UID nginx
RUN groupmod -g $GID nginx

COPY .docker/nginx-prod/default.conf.template /etc/nginx/templates/default.conf.template
