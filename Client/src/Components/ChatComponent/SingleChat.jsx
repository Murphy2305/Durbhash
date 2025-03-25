import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModal from "../Miscllaneous/ProfileModal";
import UpdateGroupChatModal from "../Miscllaneous/UpdateGroupChatModal";
import axios from "axios";
import "../../Styles/ChatBox.css";
import ScrollableChats from "./ScrollableChats";
import Lottie from "react-lottie";
import animationData from "../../animations/typinAnimation.json";
import io from "socket.io-client";

const ENDPOINT = "https://durbhash-backend.onrender.com";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, setSelectedChat, selectedChat, notification, setNotification } = ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();
    socket.emit("join chat", selectedChat._id);
  }, [selectedChat]);

  useEffect(() => {
    const messageListener = (newMessageRecieved) => {
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        if (!notification.some((msg) => msg._id === newMessageRecieved._id)) {
          setNotification((prev) => [newMessageRecieved, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    };

    socket.on("message recieved", messageListener);
    return () => socket.off("message recieved", messageListener);
  }, [selectedChat, notification]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } }
        );
        setMessages((prev) => [...prev, data]);
        socket.emit("new message", data);
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Message sending failed!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
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
          <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            )}
          </Text>
          <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
            {loading ? <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" /> : <ScrollableChats messages={messages} />}
            <FormControl onKeyDown={sendMessage} isRequired mb={3} mt={3}>
              {isTyping && <Lottie options={{ loop: true, autoplay: true, animationData, rendererSettings: { preserveAspectRatio: "xMidYMid slice" } }} height={30} width={60} style={{ marginBottom: 15, marginLeft: 0 }} />}
              <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message..." value={newMessage} onChange={typingHandler} />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontFamily="Work sans" pb={3} fontSize="3xl">Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
