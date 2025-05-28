install:
	npm install

build:
	npm run build

start: start-backend start-frontend

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --watch --progress

lint:
	npx eslint .