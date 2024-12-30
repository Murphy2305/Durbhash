const mongoose = require('mongoose');
const dotenv = require('dotenv')

const connectDB = async()=>{
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI,{
    dbName : "Durbhash"
});

        console.log(`Connection successful of Mongodb at ${mongoose.connection.host}`);
        


    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();        
    }
};

module.exports = connectDB;