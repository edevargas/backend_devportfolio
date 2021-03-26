const express, { Request, Response } = require('express')
import { Request, Response } from 'express'
import Sentry from '@sentry/node'
require('dotenv').config()
import Tracing from '@sentry/tracing'
const cors = require('cors')
const app = express()
if(process.env.NODE_ENV != 'test') {
  Sentry.init({  
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app })
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}
require('./db/mongo')
const Project = require('./models/Project')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const logger = require('./middlewares/loggerMiddleware')
app.use(cors())
app.use(express.json())
app.use(logger)

if(process.env.NODE_ENV != 'test') {
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())
}

app.get('/', (request: Request, response: Response) => {
  response.send('<h1>Hi from dev Portfolio v1.0.0</h1>')
})

app.get('/api/projects', async (request: Request, response: Response) => {
  const projects = await Project.find({})
  response.json(projects)
})

app.get('/api/projects/:id', (request: Request, response: Response, next) => {
  const { id } = request.params
  Project.findById(id)
    .then((result: any) => {
      result ? response.json(result) : response.status(404).end()
    })
    .catch(next)
})

app.post('/api/projects', async (request: Request, response: Response, next) => {
  const project = request.body
  if (!project || !project.name) {
    return response.status(400).json({
      error: 'Is not a valid project'
    })
  }
  const newProject = new Project({
    ...project,
    creationDate: new Date().toISOString()
  })
  try {
    const savedProject = await newProject.save()
    response.json(savedProject)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/projects/:id', async (request: Request, response: Response, next) => {
  const { id } = request.params
  try {
    await Project.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.put('/api/projects/:id', async (request: Request, response: Response, next) => {
  const { id } = request.params
  const project = request.body
  if (Object.keys(project).length === 0 || !project) {
    response.status(400).send({
      error: 'Project can not be an empty object'
    })
  }

  const projectEdited = {
    ...project,
    modificationDate: new Date().toISOString()
  }
  try {
    const result = await Project.findByIdAndUpdate(id, projectEdited, { new: true })
    result
      ? response.json(result)
      : next({
        name: 'NotFound',
        error: `Project with id ${id} does not exists`
      })
  } catch (error) {
    next(error)
  }
})

if(process.env.NODE_ENV != 'test') {
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())
}

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
module.exports = { app, server }
