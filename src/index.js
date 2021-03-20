const express = require('express')
const logger = require('./middlewares/loggerMiddleware')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

const { projects } = require('./data')

app.get('/', (request, response) => {
  response.send('<h1>Hi from dev Portfolio v1.0.0</h1>')
})

app.get('/api/projects', (request, response) => {
  response.json(projects)
})

app.get('/api/projects/:id', (request, response) => {
  const { id } = request.params
  const project = projects.find((p) => p._id === id)
  project ? response.json(project) : response.status(404).end()
})

app.post('/api/projects', (request, response) => {
  const project = request.body
  if (!project || !project.name) {
    return response.status(400).json({
      error: 'Is not a valid project'
    })
  }
  const randomId = Math.random().toString(36)
  const newProject = {
    ...project,
    _id: randomId,
    creationDate: new Date().toISOString()
  }
  const lastIndex = projects.length
  projects.splice(lastIndex + 1, 0, newProject)
  response.json(newProject)
})

app.delete('/api/projects/:id', (request, response) => {
  const { id } = request.params
  const idx = projects.findIndex((p) => p._id === id)
  if (idx >= 0) {
    projects.splice(idx, 1)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

app.use((request, response, next) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
