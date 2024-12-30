import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {getSender, getSenderFull} from '../../config/ChatLogic'
import ProfileModal from '../Miscllaneous/ProfileModal'
import UpdateGroupChatModal from "../Miscllaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, setSelectedChat, selectedChat } = ChatState();

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
                    ></UpdateGroupChatModal>
                
            </>)
            }
          </Text>

            <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >

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
