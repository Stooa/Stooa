#!/usr/bin/env bash

# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

sleep 10;

console cache:warmup --no-interaction

console messenger:consume -vv >&1
