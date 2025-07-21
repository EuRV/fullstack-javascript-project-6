setup: prepare install db-migrate

install:
	npm install

build:
	npm run build

migrate:
	knex migrate:latest

prepare:
	cp -n .env.example .env || true

start: start-frontend start-backend

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack

lint:
	npx eslint .

test:
	npm test
	
test-coverage:
	npm test -- --coverage --coverageProvider=v8