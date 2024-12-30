const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');
const Message = require('../Models/messageModel');

const sendMessage = asyncHandler(async (req,res) => {

    const {chatId,content} = req.body;
    if(!content || !chatId)
    {
        console.log("Invalid data passed into request");
        res.sendStatus(400);        
    }

    var newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId
    };

    try {
        var message = await Message.create(newMessage);
        message = await message.populate('sender', 'name pic');
        message = await message.populate('chat');
        message = await message.populate({
            path: 'chat.users',
            select: 'name pic email',
        });
        
        res.json(message);


    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    
    }

    
})

const allMessages = asyncHandler(async (req,res) => {
    

    
})


module.exports = {sendMessage,allMessages};