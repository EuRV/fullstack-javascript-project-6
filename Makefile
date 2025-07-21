.PHONY: setup install build prepare start \
        dev-migrate dev-rollback dev-reset \
        prod-migrate prod-rollback prod-reset prod-deploy \
        start-backend start-backend-prod start-frontend start-frontend-prod \
        lint test test-coverage db-migrate db-reset

setup: prepare install prod-deploy

install:
	npm ci

build:
	npm run build

# Development
dev-migrate:
	@npm run dev:migrate

dev-rollback:
	@npm run dev:migrate:rollback

dev-reset:
	@npm run dev:reset

# Production
prod-migrate:
	@npm run migrate

prod-rollback:
	@npm run migrate:rollback

prod-reset:
	@npm run reset

prod-deploy:
	@npm run postdeploy

prepare:
	cp -n .env.example .env || true

start: start-frontend start-backend

start-prod: build start-backend-prod

start-backend:
	npm run dev

start-backend-prod:
	npm start

start-frontend:
	npx webpack --mode=development --watch

start-frontend-prod:
	npx webpack --mode=production

lint:
	npm run lint

test:
	npm test

test-coverage:
	npm run test:coverage

# Aliases
db-migrate: dev-migrate
db-reset: dev-reset