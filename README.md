## RESTful API using Node Typescript Server
This package contains a template of node-express-typescript server.
This package is built to handle JWT authentication with error handling using middlewares.
To get started a user route is added. using this template you can create your routes.
MongoDB is configured but you can customize the DB based upon your requirement.
Morgan logger is used for logging.
Migrate-mongo is used for migrations and faker is used for creating test db.

# Project structure
```
- src
    - server.ts                          #Express App
    - controllers                        #Controllers for the routes
    - middlewares                        #Authentication Middlewares
    - models                             #Schema Models
    - routes                             #App routes
    - services                           #Services for the routes
    - utils                              #Utils
    - .env.example                       #Environmental variables
    - migrate-mongo-config.js            #Config file of migrate mongo
    - package.json
    - README.MD
    - tsconfig.json
```

## Quick Start
To create a project, simply run:

```bash
npx create-node-express-ts-boilerplate <project-name>
```
Or

```bash
npm init node-express-ts-boilerplate <project-name>
```

## Manual Installation

Clone the repo:

```bash
git clone --depth 1 https://github.com/vigneshdemitro/node-express-ts-boilerplate.git
cd node-express-ts-boilerplate.git
```

Install the dependencies

```bash
$ npm install
```

# Setting up Environmental variables

- copy .env.example and create .env
- .env can be configured according to the usage

## Generating dataset

```bash
$ npm run migrate

This creates the users with dummy data with help of faker-js
```

## Running the app

```bash
# production
$ npm run start

Starts the server in the production mode.\
[http://localhost:4001/api/v1](http://localhost:4001/api/v1) to do postman tests.
```

```bash
# development
$ npm run dev

Starts the server in the development mode.\
[http://localhost:4001/api/v1](http://localhost:4001/api/v1) to do postman tests.
```