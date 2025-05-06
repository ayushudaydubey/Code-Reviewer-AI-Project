
import app from './src/app.js';
import connectToDB from './src/db/db.js';
import config from './src/config/config.js';
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import messageModel from './src/Models/message.model.js'
import projectModel from './src/Models/Project.model.js';
import { getReview } from './src/services/ai.services.js';

const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
io.on('connection', (socket) => {
  const project = socket.handshake.query.project
  socket.join(project)

  console.log("user connected ");

  socket.on('disconnect', data => {
    console.log("user disconnected ");


  });

  socket.on("chat-history", async () => {
    const message = await messageModel.find({ project: project })
    socket.emit("chat-history", message)
  })

  socket.on('chat-message', async message => {
    // console.log(message);
    await messageModel.create({
      project: project,
      text: message
    })
    socket.broadcast.to(project).emit("chat-message", message)

  });

  socket.on("get-project-code", async () => {
    const projectData = await projectModel.findById(project).select("code");
    socket.emit("project-code", projectData.code);
  });

  socket.on("code-change", async (code) => {
    socket.broadcast.to(project).emit('code-change', code)
    await projectModel.findOneAndUpdate({ _id: project },
      {
        code: code
      })
  })

  socket.on("get-review", async(code) => {
    const review = await getReview(code)
    socket.emit("get-review", review)
  })

});

server.listen(process.env.PORT, () => {
  connectToDB();
  console.log("Server is run on Loaclhost ");

})