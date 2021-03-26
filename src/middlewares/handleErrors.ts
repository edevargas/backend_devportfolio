import {Request, Response} from 'express'
module.exports = (error: any, request: Request, response: Response, next: any) => {
  console.error(error)
  switch (error.name) {
    case 'CastError':
      response.status(400).send({ error: 'Id malformed' })
      break
    case 'NotFound':
      response.status(404).send({ error: 'Not Found', message: error.message })
      break

    default:
      response.status(500).json({ error: error })
      break
  }
}
