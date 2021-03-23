if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log('Database connection fail', err)
  })

process.on('uncaughtException', () => {
  console.log('disconnected')
  mongoose.connection.close()
})
