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
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));



// app.use(express.static('public'));

connectDB();


const PORT = process.env.PORT||5007;
const data1 = 
    {
        "kpss" : "bad at luck hAHAHAH"
    }

// app.get('/chart',(req,res)=>{
//     res.json(data);
// })





app.use('/user',userRoute);
app.use('/chat',chatRoute);
app.use('/message', messageRoute);




//DEPLOYMENT CODE IS HERE
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

const io = require('socket.io')(server,{
    pingTimeout : 60000,
    cors:{
        origin: "http://localhost:5173",
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
