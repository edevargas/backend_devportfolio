const express = require('express')
const app = express()

const { projects } = require('./data')

/**
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json'})
    response.end(JSON.stringify(projects))
})
 */

app.get('/', (request, response) => {
    response.send('<h1>Hi from dev Portfolio v1.0.0</h1>')
})

app.get('/api/projects', (request, response) => {
    response.json(projects)
})

app.get('/api/projects/:id', (request, response) => {
    const { id } = request.params
    const project = projects.find(p => p._id === id)
    response.json(project)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log('Server started on port ${PORT}')
})