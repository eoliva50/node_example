/* eslint-disable import/no-extraneous-dependencies */
import './helpers/dotenv'

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import logger from './helpers/logger'
import router from './routes'
import { notFound, errorHandler } from './helpers/errors'
import basicAuth from 'express-basic-auth'

const port = Number(process.env.PORT)

const app = express()

app.use(
  basicAuth({
    users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASSWORD }
  })
)

app.use(morgan(process.env.MORGAN_LOG))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    exposedHeaders: ['x-total-count', 'x-total-pages'],
  }),
)
app.use(helmet())
app.use(bodyParser.json())

app.use('/', router)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})