# Getting Started - Local Development

## Prerequisite

Required system dependencies

- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)
- [Docker](https://www.docker.com/)

Recommended system dependencies

- [VSCode](https://code.visualstudio.com/) (Install recommended extensions in the workspace)

## Setup

At the root of the project, inside the terminal

```bash
# Start external dependencies (e.g. Database, Queues, Crons...)
docker-compose up -d

# Build dependencies, run migrations and seeds etc.
yarn setup
```

PostgresQL Database runs on `localhost:5432`

## Development

Then,

```bash
yarn start
```

API Gateway runs on `localhost:4000`  
Web Application runs on `localhost:3000`

Next: [Learn development](/documentation/DEVELOPMENT.md)
