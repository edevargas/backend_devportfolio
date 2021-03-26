const { server } = require('@app')
const mongoose = require('mongoose')
const Project = require('@models/Project')
import {
  api,
  initialProjects,
  getAllProjectNames,
  newProject,
  getFirstProject
} from './helpers/projectsHelper'

beforeEach(async () => {
  await Project.deleteMany({})
  await Project.insertMany(initialProjects)
})
describe('Projects', () => {
  describe('-> Get all', () => {
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
      const { names } = await getAllProjectNames()
      expect(names).toContain('I am de first dummy project')
    })
  })

  describe('-> Create one', () => {
    test('a valid project can be added', async () => {
      await api
        .post('/api/projects')
        .send(newProject)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const { names } = await getAllProjectNames()
      expect(names).toContain('NextJS app')
      expect(names).toHaveLength(initialProjects.length + 1)
    })

    test('a empty project can not be added', async () => {
      const emptyProject = {}
      await api
        .post('/api/projects')
        .send(emptyProject)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/projects')
      expect(response.body).toHaveLength(initialProjects.length)
    })
  })

  describe('-> Delete one', () => {
    test('a valid project can be deleted', async () => {
      const allProjects = await api.get('/api/projects')
      const projectToDelete = allProjects.body[0]

      await api
        .delete(`/api/projects/${projectToDelete.id}`)
        .expect(204)

      const { names } = await getAllProjectNames()
      expect(names).toHaveLength(initialProjects.length - 1)
      expect(names).not.toContain(projectToDelete.name)
    })
    test('a invalid project can not be deleted', async () => {
      await api
        .delete('/api/projects/12345')
        .expect(400)

      const { names } = await getAllProjectNames()
      expect(names).toHaveLength(initialProjects.length)
    })
  })

  describe('-> Update one', () => {
    test('a valid project can be updated', async () => {
      const projectToUpdate = await getFirstProject()
      projectToUpdate.name = 'I am the first dummy project'

      await api
        .put(`/api/projects/${projectToUpdate.id}`)
        .send(projectToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const { names } = await getAllProjectNames()
      expect(names).toHaveLength(initialProjects.length)
      expect(names).toContain(projectToUpdate.name)
    })
    test('an empty project can not be updated', async () => {
      const projectToUpdate = await getFirstProject()
      await api
        .put(`/api/projects/${projectToUpdate.id}`)
        .send({})
        .expect(400)

      const { names } = await getAllProjectNames()
      expect(names).toHaveLength(initialProjects.length)
    })
    test('an invalid id project can not be updated', async () => {
      const projectToUpdate = await getFirstProject()
      const originalName = projectToUpdate.name
      projectToUpdate.name = 'I dont have to be modified'

      await api
        .put('/api/projects/12345')
        .send(projectToUpdate)
        .expect(400)

      const { names } = await getAllProjectNames()
      expect(names).toContain(originalName)
      expect(names).toHaveLength(initialProjects.length)
    })
    test('an project that does not exists can not be updated', async () => {
      const projectToUpdate = await getFirstProject()
      const originalName = projectToUpdate.name
      projectToUpdate.name = 'I dont have to be modified'

      await api
        .put('/api/projects/6057f6482f086cb6805abb40')
        .send(projectToUpdate)
        .expect(404)

      const { names } = await getAllProjectNames()
      expect(names).toContain(originalName)
      expect(names).toHaveLength(initialProjects.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
