# 🧪 RESTful API with Node.js and Express.js in TypeScript

## Status

[![Node.js CI](https://github.com/nanotaboada/ts-node-samples-express-restful/actions/workflows/node.js.yml/badge.svg)](https://github.com/nanotaboada/ts-node-samples-express-restful/actions/workflows/node.js.yml) [![CodeFactor](https://www.codefactor.io/repository/github/nanotaboada/ts-node-samples-express-restful/badge)](https://www.codefactor.io/repository/github/nanotaboada/ts-node-samples-express-restful) [![Maintainability](https://api.codeclimate.com/v1/badges/1edb822ce7fdb04f41e9/maintainability)](https://codeclimate.com/github/nanotaboada/ts-node-samples-express-restful/maintainability) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/c845d2bc280d4840a86a56a91407cea7)](https://app.codacy.com/gh/nanotaboada/ts-node-samples-express-restful/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade) [![codecov](https://codecov.io/gh/nanotaboada/ts-node-samples-express-restful/graph/badge.svg?token=VxKaWl2DfD)](https://codecov.io/gh/nanotaboada/ts-node-samples-express-restful) [![Known Vulnerabilities](https://snyk.io/test/github/nanotaboada/ts-node-samples-express-restful/badge.svg)](https://snyk.io/test/github/nanotaboada/ts-node-samples-express-restful)

## Manifesto

> "Nobody should start to undertake a large project. You start with a small _trivial_ project, and you should never expect it to get large. If you do, you'll just overdesign and generally think it is more important than it likely is at that stage. Or worse, you might be scared away by the sheer size of the work you envision. So start small, and think about the details. Don't think about some big picture and fancy design. If it doesn't solve some fairly immediate need, it's almost certainly over-designed. And don't expect people to jump in and help you. That's not how these things work. You need to get something half-way _useful_ first, and then others will say "hey, that _almost_ works for me", and they'll get involved in the project." — Linus Torvalds

## About

Proof of Concept for a RESTful API made with [Node.js](https://nodejs.org/) 20.x LTS and [Express.js](https://expressjs.com/) 4 in [TypeScript](https://www.typescriptlang.org/).

## Structure

The following is a simplified dependency diagram of modules and main libraries:

![Dependency Diagram](ts-node-samples-express-restful.svg)

## Install

```console
npm install
```

## Run

```console
npm run dev
```

By default the application server will start as follows:

```console
> ts-node-samples-express-restful@1.0.0 dev
> nodemon

[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node ./src/server.ts`
[server]: Server is running at http://localhost:9000
```

You can change the port by setting the `PORT` environment variable in the `.env` file.

```console
# /.env
PORT=9999
```

## Documentation

```console
http://localhost:9000/swagger/
```

![API Documentation](ts-node-samples-express-restful-swagger.png)

## Credits

The solution has been coded using [Visual Studio Code](https://code.visualstudio.com/).

## Terms

All trademarks, registered trademarks, service marks, product names, company names, or logos mentioned on this repository are the property of their respective owners. All usage of such terms herein is for identification purposes only and constitutes neither an endorsement nor a recommendation of those items. Furthermore, the use of such terms is intended to be for educational and informational purposes only.
