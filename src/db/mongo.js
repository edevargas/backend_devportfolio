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

// const newProject = new Project({
//   name: 'Project from mongoose',
//   description: 'lorem',
//   categories: ['design', 'mobile'],
//   user: '111',
//   url: 'http://google.com'
// })
// Project.find({})
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
