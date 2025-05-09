import express from 'express'
import projectRoutes from '../src/Routes/project.routes.js'
import cors from 'cors'
const app  =  express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get("",(req,res)=>{
  res.send("Home Page")
})

app.use("/projects",projectRoutes)

export default  app