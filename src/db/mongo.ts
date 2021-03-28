import mongoose = require('mongoose')

const { NODE_ENV, MONGO_DB_URI, MONGO_DB_URI_TEST } = process.env

let connectionString = ''

switch (NODE_ENV) {
case 'production':
  connectionString = MONGO_DB_URI || ''
  break
case 'development':
  connectionString = MONGO_DB_URI || ''
  break
case 'test':
  connectionString = MONGO_DB_URI_TEST || ''
  break

default:
  break
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Database connected')
  })
  .catch((err: any) => {
    console.log('Database connection fail', err)
  })

process.on('uncaughtException', () => {
  console.log('disconnected')
  mongoose.connection.close()
})
