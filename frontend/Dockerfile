# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

# BASE
FROM node:18.11 as base

ARG UID=1000
ARG GID=1000

RUN usermod --uid $UID node
RUN groupmod --non-unique --gid $GID node

RUN mkdir -p /tmp
RUN chmod 1777 /tmp

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
FROM nginx:1.23 as nginx

ARG UID=1000
ARG GID=1000

RUN usermod --uid $UID nginx
RUN groupmod --non-unique --gid $GID nginx

COPY .docker/nginx-prod/default.conf.template /etc/nginx/templates/default.conf.template
