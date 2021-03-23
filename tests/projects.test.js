const { server } = require('../src/index.js')
const mongoose = require('mongoose')
const Project = require('../src/models/Project')
const {
  api,
  initialProjects,
  getAllProjectNames
} = require('./helpers/projectsHelper')

beforeEach(async () => {
  await Project.deleteMany({})
  await Project.insertMany(initialProjects)
})

describe('projects get all', () => {
  test('are returned as a json', async () => {
    await api.get('/api/projects')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('there are two projects', async () => {
    const response = await api.get('/api/projects')
    expect(response.body).toHaveLength(initialProjects.length)
  })
  test('the first note is name is I am de first dummy project', async () => {
    const projectNames = await getAllProjectNames()
    expect(projectNames).toContain('I am de first dummy project')
  })
})

describe('projects create one', () => {
  test('a valid project can be added', async () => {
    const newProject = {
      categories: [
        'frontend',
        'product design'
      ],
      name: 'NextJS app',
      description: 'lorem 2',
      user: '222',
      url: 'http://google.com',
      creationDate: new Date().toISOString
    }
    await api
      .post('/api/projects')
      .send(newProject)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const projectNames = await getAllProjectNames()
    expect(projectNames).toContain('NextJS app')
    expect(projectNames).toHaveLength(initialProjects.length + 1)
  })

  test('a empty project can not be added', async () => {
    const newProject = {}
    await api
      .post('/api/projects')
      .send(newProject)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/projects')
    expect(response.body).toHaveLength(initialProjects.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
