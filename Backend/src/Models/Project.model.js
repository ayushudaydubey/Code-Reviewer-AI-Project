import mongoose  from 'mongoose'

const projectSchema  = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'project name is require']
  },
  code:{
    type:String,
    default :""
  },
  review:{
    type:String,
    default:""
  }
},{timestamps:true})

const projectModel  = mongoose.model("Project",projectSchema)

export default projectModel