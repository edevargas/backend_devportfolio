const supertest = require('supertest')
const { app } = require('../../src/index.js')

const api = supertest(app)

const getAllProjectNames = async () => {
  const response = await api.get('/api/projects')
  return response.body.map(p => p.name)
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

module.exports = {
  api,
  initialProjects,
  getAllProjectNames
}
