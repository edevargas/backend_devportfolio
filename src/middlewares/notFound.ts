import {Request, Response} from 'express'
const notFound = (request: Request, response: Response, next: any) => response.status(404).json({
  error: 'Not found'
})

module.exports = notFound
