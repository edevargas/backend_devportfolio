const express = require('express')
const logger = require('./middlewares/loggerMiddleware')
const cors = require('cors')
const app = express()
require('./db/mongo')

app.use(cors())
app.use(express.json())
app.use(logger)

const Project = require('./models/Project')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

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
    .catch(err => {
      next(err)
    })
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
    .catch(err => {
      next(err)
    })
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
    .catch(err => {
      next(err)
    })
})

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
