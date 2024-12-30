import React from 'react'
import { useState } from 'react';
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../Components/ChatComponent/SideDrawer';
import MyChats from '../Components/ChatComponent/MyChats';
import ChatBox from '../Components/ChatComponent/ChatBox';
import { Box } from "@chakra-ui/react"

const ChatsPage = () => {

  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", color: "green", backgroundColor: "white"}}>
       <SideDrawer />
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  )
}

export default ChatsPage
