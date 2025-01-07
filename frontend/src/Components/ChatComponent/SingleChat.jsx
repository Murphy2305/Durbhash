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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, setSelectedChat, selectedChat } = ChatState();

  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newMessage, setnewMessage] = useState("");


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
        setMessages([...messages, data]);
        console.log(data);
        
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


  const typingHandler =(e)=>{
    setnewMessage(e.target.value);
  };



  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);



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
