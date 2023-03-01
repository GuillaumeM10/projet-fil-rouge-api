## Installation

```bash
$ npm install
```

## IMPORTANT Running the app
Don't forget to create a .env file in the root of the project.

DOCKER
```bash
# reset containers
$ make reset

# start containers
$ make up

# stop containers
$ make down
```

NESTJS
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Utils Commands Via CLI

```bash
# generate module
$ nest g mo <module-name>

# generate controller
$ nest g co <controller-name>

# generate  service
$ nest g s <service-name>

# generate resource
$ nest g res <resource-name>
```