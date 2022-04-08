# This file is part of the Stooa codebase.
#
# (c) 2020 - present Runroom SL
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

AUTOLOAD = backend/vendor/autoload.php
JITSI_CONFIG = jitsi-meet-cfg/jvb/logging.properties
CERTS_DIR = .certs
UID = $(shell id -u)
GID = $(shell id -g)

docker-exec-backend = docker compose exec backend /bin/bash -c "$1"
docker-exec-frontend = docker compose exec frontend /bin/bash -c "$1"

.PHONY: up composer build halt destroy ssh ssh-front certs provision provision-backend \
		composer-install composer-normalize phpstan php-cs-fixer phpunit phpunit-coverage \
		assets cache-clear database provision-jitsi

# Docker
up: $(JITSI_CONFIG) compose $(AUTOLOAD)

compose: $(CERTS_DIR)
	docker compose up -d

build: halt
	docker compose build --build-arg UID=$(UID) --build-arg GID=$(GID)

halt:
	docker compose stop

destroy:
	docker compose down --remove-orphans

ssh:
	docker compose exec backend /bin/bash

ssh-front:
	docker compose exec frontend /bin/bash

$(CERTS_DIR):
	$(MAKE) certs

certs:
	mkdir -p $(CERTS_DIR)
	mkcert -install
	mkcert -cert-file $(CERTS_DIR)/certificate.crt -key-file $(CERTS_DIR)/certificate.key localhost

provision: provision-backend provision-jitsi

# BACKEND
$(AUTOLOAD):
	$(MAKE) provision-backend

provision-backend: composer-install assets database

composer-install:
	$(call docker-exec-backend,composer install --optimize-autoloader)

composer-normalize:
	$(call docker-exec-backend,composer normalize)

phpstan:
	$(call docker-exec-backend,composer phpstan)

php-cs-fixer:
	$(call docker-exec-backend,composer php-cs-fixer)

phpunit:
	$(call docker-exec-backend,phpunit)

phpunit-coverage:
	$(call docker-exec-backend,phpunit --coverage-html /usr/app/coverage)

cache-clear:
	$(call docker-exec-backend,rm -rf /usr/app/cache/*)

assets:
	$(call docker-exec-backend,console assets:install public)

database:
	$(call docker-exec-backend,console doctrine:database:drop --no-interaction --force)
	$(call docker-exec-backend,console doctrine:database:create --no-interaction)
	$(call docker-exec-backend,console doctrine:schema:update --no-interaction --force)
	$(call docker-exec-backend,console doctrine:fixtures:load --no-interaction --append)

# JITSI
$(JITSI_CONFIG):
	$(MAKE) provision-jitsi

provision-jitsi:
	mkdir -p jitsi-meet-cfg/{prosody/config,prosody/prosody-plugins-custom,jicofo,jvb}
	rm -rf jitsi-meet-cfg/prosody/config/*
	rm -rf jitsi-meet-cfg/prosody/prosody-plugins-custom/*
	rm -rf jitsi-meet-cfg/jicofo/*
	rm -rf jitsi-meet-cfg/jvb/*
