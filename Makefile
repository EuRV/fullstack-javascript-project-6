setup: prepare install prod-deploy

install:
	npm install

build:
	npm run build

# Development окружение
dev-migrate:  ## Применить миграции (development)
	@npm run dev:migrate

dev-rollback: ## Откатить последнюю миграцию (development)
	@npm run dev:migrate:rollback

dev-reset:    ## Полный сброс БД: откат + миграции
	@npm run dev:reset

# Production окружение (для Render/Heroku)
prod-migrate:  ## Применить миграции (production)
	@npm run migrate

prod-rollback: ## Откатить последнюю миграцию (production)
	@npm run migrate:rollback

prod-reset:    ## Полный сброс БД в production (ОСТОРОЖНО!)
	@npm run reset

prod-deploy:   ## Полный деплой для Render.com
	@npm run postdeploy

prepare:
	cp -n .env.example .env || true

start: start-frontend start-backend

start-prod: start-frontend-prod start-backend-prod

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-backend-prod:
	npm start

start-frontend:
	npx webpack --mode=development

start-frontend-prod:
	npx webpack --mode=production

lint:
	npx eslint .

test:
	npm test
	
test-coverage:
	npm test -- --coverage --coverageProvider=v8

# Алиасы для удобства
db-migrate: dev-migrate    ## Алиас для dev-migrate
db-reset: dev-reset       ## Алиас для dev-reset