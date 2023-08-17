db-migrate:
	npx knex migrate:latest

db-rollback:
	npx knex migrate:rollback

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage

test:
	npm test