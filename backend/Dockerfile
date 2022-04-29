# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

# BASE
FROM php:8.1-fpm-buster as base

ARG UID=1000
ARG GID=1000

RUN usermod -u $UID www-data
RUN groupmod -g $GID www-data

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/

RUN install-php-extensions apcu bz2 gd intl opcache pdo_mysql zip gmp
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    unzip \
    libfcgi-bin \
    mariadb-client \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

ENV PATH="/usr/app/vendor/bin:/usr/app/bin:${PATH}"

RUN mv $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

COPY .docker/app-prod/healthcheck.sh /usr/local/bin/healthcheck
COPY .docker/app-prod/extra.ini /usr/local/etc/php/conf.d/extra.ini
COPY .docker/app-prod/www.conf /usr/local/etc/php-fpm.d/www.conf

RUN chmod +x /usr/local/bin/healthcheck

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN chown $UID:$GID /var/www

USER www-data

WORKDIR /usr/app

# FPM-PROD
FROM base as fpm

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

ENTRYPOINT ["bash", "/usr/app/.docker/app-prod/php-fpm.sh"]


# FPM-DEV
FROM base as fpm-dev

USER root

RUN install-php-extensions pcov xdebug

USER www-data

CMD ["php-fpm", "--allow-to-run-as-root"]


# NGINX
FROM nginx:1.21 as nginx

ARG UID=1000
ARG GID=1000

RUN usermod -u $UID nginx
RUN groupmod -g $GID nginx

COPY --chown=$UID:$GID --from=fpm /usr/app/public /usr/app/public

COPY .docker/nginx-prod/default.conf.template /etc/nginx/templates/default.conf.template
