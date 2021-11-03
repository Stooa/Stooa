#!/usr/bin/env bash

# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

console cache:warmup --no-interaction

if [ "${RESET_DATABASE:-}" = true ]; then
    console doctrine:database:drop --no-interaction --force
    console doctrine:database:create --no-interaction
fi

console doctrine:migrations:migrate --no-interaction --allow-no-migration

php-fpm --allow-to-run-as-root
