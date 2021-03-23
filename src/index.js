const express = require('express')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const cors = require('cors')
const app = express()
Sentry.init({
  dsn: 'https://7d89f2ebd0b14eb1aeed565b79b544fb@o556750.ingest.sentry.io/5688136',
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
require('./db/mongo')
const Project = require('./models/Project')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const logger = require('./middlewares/loggerMiddleware')
app.use(cors())
app.use(express.json())
app.use(logger)

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  response.send('<h1>Hi from dev Portfolio v1.0.0</h1>')
})

app.get('/api/projects', (request, response) => {
  Project.find({})
    .then(result => {
      response.json(result)
    })
    .catch(err => response.status(500).json({
      error: err
    }))
})

app.get('/api/projects/:id', (request, response, next) => {
  const { id } = request.params
  Project.findById(id)
    .then(result => {
      result ? response.json(result) : response.status(404).end()
    })
    .catch(next)
})

app.post('/api/projects', (request, response) => {
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
  newProject.save()
    .then(result => {
      // mongoose.connection.close()
      response.json(result)
    })
    .catch(err => response.status(500).json({
      error: err
    })
    )
})

app.delete('/api/projects/:id', (request, response, next) => {
  const { id } = request.params
  Project.findByIdAndDelete(id)
    .then(result => {
      result
        ? response.status(204).end()
        : response.status(404).send({
          error: `Project with id ${id} does not exists`
        })
    })
    .catch(next)
})

app.put('/api/projects/:id', (request, response, next) => {
  const { id } = request.params
  const project = request.body
  const projectEdited = {
    ...project,
    modificationDate: new Date().toISOString()
  }
  Project.findByIdAndUpdate(id, projectEdited, { new: true })
    .then(result => {
      result
        ? response.json(result)
        : response.status(404).send({
          error: `Project with id ${id} does not exists`
        })
    })
    .catch(next)
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
