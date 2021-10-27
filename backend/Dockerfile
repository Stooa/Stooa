# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

# BASE
FROM php:7.4-fpm-buster as base

WORKDIR /usr/app

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN install-php-extensions apcu bz2 gd intl opcache pdo_mysql zip gmp
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    unzip \
    libfcgi-bin \
    mariadb-client \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

RUN mv $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

COPY .docker/app-prod/healthcheck.sh /usr/local/bin/healthcheck
COPY .docker/app-prod/extra.ini /usr/local/etc/php/conf.d/extra.ini
COPY .docker/app-prod/www.conf /usr/local/etc/php-fpm.d/www.conf

RUN chmod +x /usr/local/bin/healthcheck

ENV PATH="/usr/app/vendor/bin:/usr/app/bin:${PATH}"


# FPM-PROD
FROM base as fpm

COPY .env /usr/app/.env

COPY composer.json /usr/app/composer.json
COPY composer.lock /usr/app/composer.lock
COPY symfony.lock /usr/app/symfony.lock

RUN composer install --prefer-dist --no-progress --no-interaction --no-dev --no-autoloader

COPY . /usr/app

RUN composer dump-autoload --classmap-authoritative
RUN composer symfony:dump-env prod
RUN console assets:install public

ENTRYPOINT ["bash", "/usr/app/.docker/app-prod/php-fpm.sh"]


# FPM-DEV
FROM base as fpm-dev

RUN install-php-extensions pcov xdebug

CMD ["php-fpm", "--allow-to-run-as-root"]


# CONSUMER
FROM fpm as consumer

ENTRYPOINT ["bash", "/usr/app/.docker/app-prod/messenger-consume.sh"]


# NGINX
FROM nginx:1.20 as nginx

COPY --from=fpm /usr/app/public /usr/app/public

COPY .docker/nginx-prod/default.conf.template /etc/nginx/templates/default.conf.template
