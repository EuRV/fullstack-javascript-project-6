setup: prepare install migrate-prod

install:
	npm install

build:
	npm run build

migrate:
	knex migrate:latest

migrate-prod:
    NODE_ENV=production knex migrate:latest

prepare:
	cp -n .env.example .env || true

start: ## Запуск приложения (dev/prod)
ifeq ($(filter prod production,$(MAKECMDGOALS)),)
	@$(MAKE) start-dev
else
	@$(MAKE) start-prod
endif

start-dev: ## Запуск в режиме разработки
	@echo "Starting in DEVELOPMENT mode..."
	@NODE_ENV=development $(MAKE) start-frontend & \
	NODE_ENV=development $(MAKE) start-backend

start-prod: ## Запуск в production режиме
	@echo "Starting in PRODUCTION mode..."
	@NODE_ENV=production $(MAKE) build
	@NODE_ENV=production $(MAKE) start-frontend
	@NODE_ENV=production $(MAKE) start-backend

start-backend:
ifeq ($(NODE_ENV),production)
	@node server/plugin.js
else
	@npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'
endif

start-frontend:
ifeq ($(NODE_ENV),production)
	@npx webpack --mode=production
else
	@npx webpack --mode=development --watch
endif

lint:
	npx eslint .

test:
	npm test
	
test-coverage:
	npm test -- --coverage --coverageProvider=v8