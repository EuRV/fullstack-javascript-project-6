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

start: start-frontend start-backend

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --mode=$(if $(filter production,$(NODE_ENV)),production,development)

lint:
	npx eslint .

test:
	npm test
	
test-coverage:
	npm test -- --coverage --coverageProvider=v8