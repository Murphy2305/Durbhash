import React from "react";
import { useState , useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {getSender, getSenderFull} from '../../config/ChatLogic'
import ProfileModal from '../Miscllaneous/ProfileModal'
import UpdateGroupChatModal from "../Miscllaneous/UpdateGroupChatModal";
import axios from "axios";
import '../../Styles/ChatBox.css'
import ScrollableChats from "./ScrollableChats";
import Lottie from 'react-lottie';
import animationData from "../../animations/typinAnimation.json";


import io from 'socket.io-client';



const ENDPOINT =  'http://127.0.0.1:5007';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {




  const { user, setSelectedChat, selectedChat } = ChatState();

  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newMessage, setnewMessage] = useState("");
  const [socketConnected,setSocketConnected] = useState(false);
   const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };




    useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit('setup',user);
    socket.on('connected',()=>setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  },[])

    
  useEffect(() => {
    fetchMessages();
        selectedChatCompare = selectedChat;

  }, [selectedChat]);


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          // setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });




  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setloading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setloading(false);
      socket.emit('join chat',selectedChat._id);
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: `Failed to send the Message ${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
   
  const sendMessage = async (event) => {

    if (event.key === "Enter" && newMessage) {

      socket.emit('stop typing',selectedChat._id);
      
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        // console.log(data);
        
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: `Failed to send the Message ${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }


  };


  const typingHandler = (e) => {
    setnewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {

      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }


    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };



  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />



            {
                !selectedChat.isGroupChat ?
                
                (<>

                        {getSender(user,selectedChat.users)}
                        <ProfileModal
                            user={getSenderFull(user, selectedChat.users)}
                        />

                
                </>
            ) :
            
            (<>
                
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                        fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                    ></UpdateGroupChatModal>
                
            </>)
            }
          </Text>

            <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
              {
                loading ? (<Spinner
                  size ="xl"
                  w={20}
                  h={20}
                  alignSelf={"center"}
                  margin={"auto"}
                />)
                :
                (<div className="message">
                  
                    <ScrollableChats
                     messages={messages}
                    ></ScrollableChats>

                </div>)
              }



              <FormControl
                onKeyDown={sendMessage}
                isRequired
                mb={3}
                mt={3}
              >
                {
                  istyping ? (
                    <Lottie
                    options={defaultOptions}
                    height={30}
                    width={60}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                  ):(<></>)
                }

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}

              />


              </FormControl>

          </Box>


        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontFamily="Work sans" pb={3} fontSize="3xl" >
            Click On User To Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
