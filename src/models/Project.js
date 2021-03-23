const { Schema, model } = require('mongoose')
const projectSchema = new Schema({
  name: String,
  description: String,
  categories: Array,
  user: String,
  url: String,
  creationDate: Date,
  modificationDate: Date
})
projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Project = model('Project', projectSchema)

module.exports = Project
