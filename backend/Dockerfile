# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

# BASE
FROM alpine:3.17 as fpm-prod

ARG PHP_VERSION=81
ARG UID=1000
ARG GID=1000
ARG USER=app
ARG GROUP=app

RUN apk add --no-cache \
    php${PHP_VERSION} \
    php${PHP_VERSION}-apcu \
    php${PHP_VERSION}-bz2 \
    php${PHP_VERSION}-ctype \
    php${PHP_VERSION}-curl \
    php${PHP_VERSION}-dom \
    php${PHP_VERSION}-fpm \
    php${PHP_VERSION}-gd \
    php${PHP_VERSION}-gmp \
    php${PHP_VERSION}-iconv \
    php${PHP_VERSION}-intl \
    php${PHP_VERSION}-mbstring \
    php${PHP_VERSION}-opcache \
    php${PHP_VERSION}-openssl \
    php${PHP_VERSION}-pcntl \
    php${PHP_VERSION}-pdo_mysql \
    php${PHP_VERSION}-phar \
    php${PHP_VERSION}-posix \
    php${PHP_VERSION}-session \
    php${PHP_VERSION}-simplexml \
    php${PHP_VERSION}-sodium \
    php${PHP_VERSION}-tokenizer \
    php${PHP_VERSION}-xml \
    php${PHP_VERSION}-xmlwriter \
    php${PHP_VERSION}-zip \
    git \
    fcgi \
    mariadb-client

RUN adduser -u $UID -D $USER

ENV PATH="/usr/app/vendor/bin:/usr/app/bin:${PATH}" \
    PHP_VERSION=${PHP_VERSION}

COPY .docker/app-prod/healthcheck.sh /etc/php${PHP_VERSION}/bin/healthcheck.sh
COPY .docker/app-prod/extra.ini /etc/php${PHP_VERSION}/conf.d/extra.ini
COPY .docker/app-prod/www.conf /etc/php${PHP_VERSION}/php-fpm.d/www.conf

RUN chmod +x /etc/php${PHP_VERSION}/bin/healthcheck.sh

COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

USER ${USER}

WORKDIR /usr/app

EXPOSE 9000
ENTRYPOINT ["ash", "/usr/app/.docker/app-prod/php-fpm.sh"]

# FPM-PROD
FROM fpm-prod as fpm

COPY .env /usr/app/.env

COPY --chown=$UID:$GID composer.json /usr/app/composer.json
COPY --chown=$UID:$GID composer.lock /usr/app/composer.lock
COPY --chown=$UID:$GID symfony.lock /usr/app/symfony.lock

RUN composer install --prefer-dist --no-progress --no-interaction --no-dev --no-autoloader

COPY --chown=$UID:$GID . /usr/app

RUN composer dump-autoload --classmap-authoritative
RUN composer symfony:dump-env prod

RUN console cache:warmup
RUN console assets:install public

# FPM-DEV
FROM fpm-prod as fpm-dev

ENV XDEBUG_MODE=off

USER root

RUN apk add --no-cache php${PHP_VERSION}-pecl-pcov --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing

RUN apk add --no-cache \
    php${PHP_VERSION}-pdo_sqlite \
    php${PHP_VERSION}-xdebug

COPY .docker/app-dev/50_xdebug.ini /etc/php${PHP_VERSION}/conf.d/50_xdebug.ini
COPY .docker/app-dev/extra.ini /etc/php${PHP_VERSION}/conf.d/extra.ini
COPY .docker/app-dev/www.conf /etc/php${PHP_VERSION}/php-fpm.d/www.conf

USER ${USER}

CMD php-fpm${PHP_VERSION}

# NGINX
FROM nginx:1.23 as nginx

ARG UID=1000
ARG GID=1000

RUN usermod --uid $UID nginx
RUN groupmod --non-unique --gid $GID nginx

COPY --chown=$UID:$GID --from=fpm /usr/app/public /usr/app/public

COPY .docker/nginx-prod/default.conf.template /etc/nginx/templates/default.conf.template

# Add --link when Docker for Mac supports it
COPY --chown=$UID:$GID --from=fpm-dev /usr/app/public /usr/app/public
