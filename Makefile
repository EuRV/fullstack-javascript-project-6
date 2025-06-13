install:
	npm install

build:
	npm run build

migrate:
	knex migrate:latest

start: start-frontend start-backend

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack

lint:
	npx eslint .