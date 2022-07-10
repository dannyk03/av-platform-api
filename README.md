<p align="center">
  <a href="avonow.com" target="_blank"><img src="https://res.cloudinary.com/avonow/image/upload/v1657264726/nextgen/platform-api.png" width="320" alt="platform-api" /></a>
</p>

[![NestJs][nestjs-shield]][ref-nestjs]
[![NodeJs][nodejs-shield]][ref-nodejs]
[![Typescript][typescript-shield]][ref-typescript]
[![Postgresql][postgresql-shield]][ref-postgresql]
[![JWT][jwt-shield]][ref-jwt]
[![Jest][jest-shield]][ref-jest]
[![Yarn][yarn-shield]][ref-yarn]
[![Docker][docker-shield]][ref-docker]

# AVO Platform API

Platform-API is a [NestJS](http://nestjs.com) project with [PostgreSQL](https://www.postgresql.org) and [TypeORM](https://typeorm.io) as Database.

Made with following (WIP)

- [nodejs-best-practice](https://github.com/goldbergyoni/nodebestpractices)
- [The Twelve-Factor App](https://12factor.net)
- [Microservice Architecture](https://microservices.io)
- NestJS Best Practice.

## Table of Contents

1. [Important](#important)
2. [Build with](#build-with)
3. [Features](#features)
4. [Prerequisites](#prerequisites)
5. [How to run the project](#install-and-run)

## Important

- To be able to install `@avo` private packages, **JFROG_AUTH_TOKEN** Must be available on your local machine.
  To obtain it, one must ask for a token from the Architects/Team-leads.

  ```bash
   JF_ENV='export JFROG_AUTH_TOKEN=<replace-value-here>'
   echo $JF_ENV >> ~/.zshrc
   source ~/.zshrc
  ```

- If you change env value of `APP_MODE` to `secure` that will trigger more `Middleware` and `Guard`.

  1. `TimestampMiddleware`, tolerant 5 minutes of request.
  2. `UserAgentMiddleware`, whitelist of user agent.
  3. `CorsMiddleware`, check cors based on configs.

## Build with

Version of the main packages and main tools.

| Name           | Version |
| -------------- | ------- |
| NestJs         | v9.x    |
| NodeJs         | v18.x   |
| Typescript     | v4.x    |
| Typeorm        | v0.3.x  |
| PostgreSQL     | v8.x    |
| Yarn           | v1.x    |
| NPM            | v8.x    |
| Docker         | v20.x   |
| Docker Compose | v2.x    |

## Features

- NestJs v9.x 🥳
- Typescript 🚀
- Authentication and Authorization (JWT, CASL Role/Ability Management) 💪
- PostgreSQL Integration with Typeorm Package 🎉
- Database Seed (NestJs-Command)
- Storage Management with AWS (S3)
- Server Side Pagination
- Url Versioning
- Request Validation Pipe with Custom Message 🛑
- Custom Error Status Code 🤫
- Logger (Morgan) and Debugger (Winston) 📝
- Centralize Configuration 🤖
- Centralize Exception Filter, and Custom Error Structure
- Multi-language (i18n) 🗣
- Request Correlation Id, Timezone Awareness, and Custom Timezone (WIP)
- Request Timeout, and Custom Timeout (WIP) ⌛️
- Support Docker Installation
- Support CI/CD with CircleCI
- Husky GitHook For Check Source Code, and Run Test Before Commit 🐶
- Linter with EsLint for Typescript
- Etc.

## Prerequisites

1. Understand [NestJs Fundamental](http://nestjs.com), Main Framework. NodeJs Framework with support fully TypeScript.
2. Understand [Typescript Fundamental](https://www.typescriptlang.org), Programming Language. It will help us to write and read the code.
3. Understand [ExpressJs Fundamental](https://nodejs.org), NodeJs Base Framework. It will help us in understanding how the NestJs Framework works.
4. Understand what Sql is and how it works as a database, especially [PostgreSQL.](https://www.postgresql.org/docs/)
5. Understand [Microservice Architecture](https://microservices.io) and the design pattern (TBD).
6. [The Twelve Factor Apps](https://12factor.net)
7. Optional, Understand [Docker](ref-docker) that can help you to run the project

## Install and Run

- Set up environment variables .env file (root):

  ```bash
  cp .env.example .env
  ```

- Run with `docker-compose` (root):

  ```bash
  docker compose --profile dev up
  ```

- (split terminal) Run the seed ONLY ONCE (will throw error on next time - nothing critical) (root):

  ```bash
  yarn seed
  ```

<!-- BADGE LINKS -->

[nestjs-shield]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[postgresql-shield]: https://img.shields.io/badge/PostgreSQL-white?style=for-the-badge&logo=postgresql&logoColor=4EA94B
[jwt-shield]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[jest-shield]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[yarn-shield]: https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white
[docker-shield]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white

<!-- Reference -->

[ref-nestjs]: http://nestjs.com
[ref-postgresql]: https://www.postgresql.org/docs/
[ref-nodejs-best-practice]: https://github.com/goldbergyoni/nodebestpractices
[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-jwt]: https://jwt.io
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-docker]: https://docs.docker.com
[ref-yarn]: https://yarnpkg.com
