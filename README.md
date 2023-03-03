https://img.shields.io/badge/Node.js-12.16.1-green
https://img.shields.io/badge/NestJS-7.0.0-green
https://img.shields.io/badge/TypeScript-3.9.7-green
https://img.shields.io/badge/PostgreSQL-12.2-green
https://img.shields.io/badge/Docker-19.03.8-green
https://img.shields.io/badge/Docker%20Compose-1.25.5-green
https://img.shields.io/badge/TypeORM-0.2.24-green
https://img.shields.io/badge/Passport-0.4.1-green
https://img.shields.io/badge/Passport%20JWT-4.0.0-green
https://img.shields.io/badge/Passport%20Local-1.0.0-green
https://img.shields.io/badge/Passport%20Github-1.1.0-green


## Installation

```bash
$ npm install
```
## IMPORTANT Running the app
Don't forget to create a .env file in the root of the project.
```bash
# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT
JWT_SECRET=secret

# mail
MAIL_HOST=localhost
MAIL_PORT=25
MAIL_USER=user@example.com
MAIL_PASSWORD=topsecret
MAIL_FROM=noreply@example.com

```

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