const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Config/db');
const userRoute = require('./Routes/userRoute');
const chatRoute = require('./Routes/chatRoute');
const messageRoute = require('./Routes/messageRoute');
const { urlencoded } = require('body-parser');
const {notFound, errorHandler} = require('./Middleware/errorMiddleware');
const path = require('path');


// comments are required
// Middleware
app.use(cors()); // Corrected by calling cors() as a function (important to call it as a function)
app.use(express.json()); 
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// console.log(path.join(__dirname, 'uploads'))

// app.use(express.static('public'));

connectDB();


const PORT = process.env.PORT||5007;
const data = 
    {
        "kpss" : "bad at luck hAHAHAH"
    }

app.get('/aa',(req,res)=>{
    res.send(data);
})





app.use('/user',userRoute);
app.use('/chat',chatRoute);
app.use('/message', messageRoute);





app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

const io = require('socket.io')(server,{
    pingTimeout : 60000,
    cors:{
        origin: "https://durbhash-7.vercel.app/",
        methods: ["POST", "GET"],
  credentials: true

    },
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });



  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });



  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
