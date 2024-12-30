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





app.get('/aa',(req,res)=>{
    res.json(data1);
})

app.use('/user',userRoute);
app.use('/chat',chatRoute);
app.use('/message', messageRoute);



app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
