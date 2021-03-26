import { Schema, model, Document } from 'mongoose'

export interface IProject extends Document {
  name: String;
  description: String;
  categories: Array<any>;
  user: String;
  url?: String;
  creationDate?: Date;
  modificationDate?: Date
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true},
  description: { type: String, required: true },
  categories: { type: Array, required: true },
  user: { type: String, required: true},
  url: { type: String, required: false },
  creationDate: { type: Date, required: false },
  modificationDate: { type: Date, required: false },
});
ProjectSchema.set('toJSON', {
  transform: (document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Project = model('Project', ProjectSchema)


module.exports = Project
