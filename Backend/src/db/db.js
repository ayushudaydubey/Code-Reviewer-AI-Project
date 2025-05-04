import mongoose from "mongoose";
import config from "../config/config.js";

function connectToDB() {
  mongoose.connect(process.env.MONGO_DB_URL)
  .then(()=>{
    console.log("Connect to DataBase");
    
  }).catch((err)=>{
    console.log(err);
    
  })
}

export default connectToDB