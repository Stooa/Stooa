#!/usr/bin/env bash

# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

console cache:warmup --no-interaction
console doctrine:migrations:migrate --no-interaction --allow-no-migration

php-fpm --allow-to-run-as-root
