clone repo
make sure you have 'avo' postgres database
create .env
yarn install
yarn migration:run
yarn seed

<!-- RESET -->

yarn schema:drop
yarn schema:sync
yarn seed
