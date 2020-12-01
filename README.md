# Express Async Await Errors

Make [Express.js](https://expressjs.com/) handle async errors graciously.

## Installation

`npm install express-async-await-errors --save`

## Usage

```js
'use strict'

const express = require('express')
const app = express()

const { catchAsyncErrorsOnRouter } = require('express-async-await-errors')
catchAsyncErrorsOnRouter(app) // you can also pass an express.Router() instead of the app

app.get('/', async (req, res) => {
  throw new Error("I'm an asynchronous error being caught!")
})

app.use(function(err, req, res, next) {
  res.status(500).send(`
    <h1>Server Error</h1>
    <pre>${err.stack}</pre>
  `)
})

app.listen(3000, () => console.log(`Example app listening on port 3000!`))
```
