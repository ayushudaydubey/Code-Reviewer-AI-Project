
import app from './src/app.js';
import connectToDB from './src/db/db.js';
import {Server as SocketServer} from 'socket.io'
import http from 'http'

const server = http.createServer(app)
const io = new SocketServer(server,{
  cors:{
    origin:'*',
    methods:['GET','POST']
  }
})
io.on('connection', (socket) => {
  console.log("user connected ");
  
  socket.on('disconnect', data => {
    console.log("user disconnected ");
    
   });

});

server.listen(process.env.PORT,()=>{
  connectToDB();
  console.log("Server is run on Loaclhost ");
  
})