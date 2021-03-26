import {Request, Response} from 'express'
const logger = (request: Request, response: Response, next: any) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('-------')
  next()
}

module.exports = logger
