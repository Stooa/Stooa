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

docker-exec-backend = docker compose exec backend /bin/ash -c "$1"
docker-exec-frontend = docker compose exec frontend /bin/bash -c "$1"

# Docker
up: $(JITSI_CONFIG) compose $(AUTOLOAD)
.PHONY: up

up-debug:
	XDEBUG_MODE=debug docker compose up -d
.PHONY: up-debug

up-prod: build-prod
	DOCKER_ENV=prod APP_ENV=prod APP_DEBUG=0 $(MAKE) compose
.PHONY: up-prod

compose: $(CERTS_DIR)
	docker compose up -d
.PHONY: compose

build: halt
	docker compose build --build-arg UID=$(UID) --build-arg GID=$(GID)
.PHONY: build

build-prod:
	DOCKER_ENV=prod $(MAKE) build
.PHONY: build-prod

halt:
	docker compose stop
.PHONY: halt

destroy:
	docker compose down --remove-orphans
.PHONY: destroy

ssh:
	docker compose exec backend /bin/ash
.PHONY: ssh

ssh-front:
	docker compose exec frontend /bin/bash
.PHONY: ssh-front

$(CERTS_DIR):
	$(MAKE) certs

certs:
	mkdir -p $(CERTS_DIR)
	mkcert -install
	mkcert -cert-file $(CERTS_DIR)/certificate.crt -key-file $(CERTS_DIR)/certificate.key localhost
.PHONY: certs

provision: provision-backend provision-jitsi
.PHONY: provision

# BACKEND
$(AUTOLOAD):
	$(MAKE) provision-backend

provision-backend: composer-install cache-clear assets database
.PHONY: provision-backend

composer-install:
	$(call docker-exec-backend,composer install --optimize-autoloader)
.PHONY: composer-install

composer-normalize:
	$(call docker-exec-backend,composer normalize)
.PHONY: composer-normalize

phpstan:
	$(call docker-exec-backend,composer phpstan)
.PHONY: phpstan

rector:
	$(call docker-exec,composer rector)
.PHONY: rector

php-cs-fixer:
	$(call docker-exec-backend,composer php-cs-fixer)
.PHONY: php-cs-fixer

phpunit:
	$(call docker-exec-backend,phpunit)
.PHONY: phpunit

phpunit-coverage:
	$(call docker-exec-backend,phpunit --coverage-html /usr/app/coverage)
.PHONY: phpunit-coverage

cache-clear:
	$(call docker-exec-backend,rm -rf /usr/app/var/cache/*)
.PHONY: cache-clear

assets:
	$(call docker-exec-backend,console assets:install public)
.PHONY: assets

database:
	$(call docker-exec-backend,console doctrine:database:drop --no-interaction --force)
	$(call docker-exec-backend,console doctrine:database:create --no-interaction)
	$(call docker-exec-backend,console doctrine:schema:update --no-interaction --force)
	$(call docker-exec-backend,console doctrine:fixtures:load --no-interaction --append)
.PHONY: database

# JITSI
$(JITSI_CONFIG):
	$(MAKE) provision-jitsi

provision-jitsi:
	mkdir -p jitsi-meet-cfg/{prosody/config,prosody/prosody-plugins-custom,jicofo,jvb}
	rm -rf jitsi-meet-cfg/prosody/config/*
	rm -rf jitsi-meet-cfg/prosody/prosody-plugins-custom/*
	rm -rf jitsi-meet-cfg/jicofo/*
	rm -rf jitsi-meet-cfg/jvb/*
.PHONY: provision-jitsi
