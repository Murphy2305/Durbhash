const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');

const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body;

    if(!userId)
    {
        console.log("UserId PARAM NOT sent with request");
        
        res.status(400).send("UserId PARAM NOT sent with request");
    }

    var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }


});

const fetchChat = asyncHandler(async(req,res)=>{

    try {

    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
    .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });


    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

})


const createGroupChat = asyncHandler(async (req,res) => {

    if(!req.body.users || !req.body.name)
    {
       return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
      
      const groupChat = await Chat.create({
          isGroupChat : true,
          users : users,
          chatName : req.body.name,
          groupAdmin : req.user

      });
      const fullGroupChat = await Chat.findOne({_id : groupChat._id})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat)
      


    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

  
})


const renameGroupChat = asyncHandler(async (req,res) => {

  const {chatName, chatId} = req.body;

  const renamedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName : chatName 
    }
    ,
    {
      new : true
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

  if(!renamedChat){
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(renamedChat);
  }

  
});

const addToGroupChat = asyncHandler(async (req,res) => {

  const {chatId, userId} = req.body;

  const addedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push : {users : userId},
    }
    ,
    {
      new : true
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!addedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(addedChat);
  }

  
});

const removeFromGroupChat = asyncHandler(async (req,res) => {

  const {chatId, userId} = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull : {users : userId},
    }
    ,
    {
      new : true
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }

  
});









module.exports = {accessChat , fetchChat , createGroupChat , renameGroupChat , addToGroupChat , removeFromGroupChat};