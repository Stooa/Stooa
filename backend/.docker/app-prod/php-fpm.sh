#!/usr/bin/env bash

# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

# Can be used on staging environments to destroy the database each time you deploy
# the application, to ensure you start with the initial data each time
if [ "${RESET_DATABASE:-}" = true ]; then
    echo 'Resetting database...'

    console doctrine:database:drop --no-interaction --force
    console doctrine:database:create --no-interaction
    console doctrine:schema:update --no-interaction --force
    APP_ENV=staging console doctrine:fixtures:load --no-interaction --append

    # Our current infrastructure does not allow to run sidecar containers to perform
    # this operation on a separate container, so we have to run it before launching php-fpm
    # exit 0
fi

# Can be used on production environments to apply migrations to the database each time
# you deploy the application, to ensure you start with the database in a correct state
if [ "${MIGRATE_DATABASE:-}" = true ]; then
    echo 'Applying migrations to database...'

    console doctrine:migrations:migrate --no-interaction --allow-no-migration

    # Our current infrastructure does not allow to run sidecar containers to perform
    # this operation on a separate container, so we have to run it before launching php-fpm
    # exit 0
fi

# Can be used on production environments to run Symfony Messenger workers
# to consume queued messages. For example: emails or long processing tasks
if [ "${CONSUME_MESSAGES:-}" = true ]; then
    echo 'Consume messages...'

    console messenger:consume async --time-limit=3600 -vv >&1

    exit 0
fi

php-fpm${PHP_VERSION}
