const supertest = require('supertest')
const { app } = require('../../src/index.js')

const api = supertest(app)

const getAllProjectNames = async () => {
  const response = await api.get('/api/projects')
  return {
    names: response.body.map(p => p.name),
    projects: response
  }
}

const initialProjects = [
  {
    name: 'I am de first dummy project',
    description: 'lorem edited',
    categories: [
      'frontend',
      'product design'
    ],
    user: '111',
    url: 'http://google.com',
    modificationDate: '2021-03-23T02:56:53.285Z'
  },
  {
    categories: [
      'design',
      'mobile'
    ],
    name: 'Project from mongoose',
    description: 'lorem',
    user: '111',
    url: 'http://google.com'
  }
]
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

const getFirstProject = async () => {
  const allProjects = await api.get('/api/projects')
  return allProjects.body[0]
}

module.exports = {
  api,
  initialProjects,
  getAllProjectNames,
  newProject,
  getFirstProject
}
