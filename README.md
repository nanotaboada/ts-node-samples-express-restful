# 🧪 RESTful API with Node.js and Express.js in TypeScript

## Status

[![Node.js CI](https://github.com/nanotaboada/ts-node-samples-express-restful/actions/workflows/node.js.yml/badge.svg)](https://github.com/nanotaboada/ts-node-samples-express-restful/actions/workflows/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nanotaboada_ts-node-samples-express-restful&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=nanotaboada_ts-node-samples-express-restful)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/c845d2bc280d4840a86a56a91407cea7)](https://app.codacy.com/gh/nanotaboada/ts-node-samples-express-restful/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![codecov](https://codecov.io/gh/nanotaboada/ts-node-samples-express-restful/graph/badge.svg?token=VxKaWl2DfD)](https://codecov.io/gh/nanotaboada/ts-node-samples-express-restful)
[![CodeFactor](https://www.codefactor.io/repository/github/nanotaboada/ts-node-samples-express-restful/badge)](https://www.codefactor.io/repository/github/nanotaboada/ts-node-samples-express-restful)
[![codebeat badge](https://codebeat.co/badges/7649d30a-da43-4ef5-aa82-cd9e40dc0c55)](https://codebeat.co/projects/github-com-nanotaboada-ts-node-samples-express-restful-master)

## Manifesto

> "Nobody should start to undertake a large project. You start with a small _trivial_ project, and you should never expect it to get large. If you do, you'll just overdesign and generally think it is more important than it likely is at that stage. Or worse, you might be scared away by the sheer size of the work you envision. So start small, and think about the details. Don't think about some big picture and fancy design. If it doesn't solve some fairly immediate need, it's almost certainly over-designed. And don't expect people to jump in and help you. That's not how these things work. You need to get something half-way _useful_ first, and then others will say "hey, that _almost_ works for me", and they'll get involved in the project." — [Linus Torvalds](https://web.archive.org/web/20050404020308/http://www.linuxtimes.net/modules.php?name=News&file=article&sid=145)

## About

Proof of Concept for a RESTful API made with [Node.js](https://nodejs.org/) [LTS/Jod](https://nodejs.org/en/blog/release/v22.11.0) and [Express.js](https://expressjs.com/) 4 in [TypeScript](https://www.typescriptlang.org/).

## Structure

![Simplified, conceptual project structure and main application flow](assets/images/structure.svg)

_Figure: Simplified, conceptual project structure and main application flow. Not all dependencies are shown._

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

![API Documentation](assets/images/swagger.png)

## Credits

The solution has been coded using [Visual Studio Code](https://code.visualstudio.com/).

## Terms

All trademarks, registered trademarks, service marks, product names, company names, or logos mentioned on this repository are the property of their respective owners. All usage of such terms herein is for identification purposes only and constitutes neither an endorsement nor a recommendation of those items. Furthermore, the use of such terms is intended to be for educational and informational purposes only.
