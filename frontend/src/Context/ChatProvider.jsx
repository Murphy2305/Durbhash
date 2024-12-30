import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const initialLoad = useRef(true); // Track the initial load to avoid redundant state updates

  useEffect(() => {
    if (initialLoad.current) {
      const userInfo = JSON.parse(localStorage.getItem('user-info'));

      if (!userInfo && !['/login', '/signup', '/'].includes(location.pathname)) {
        navigate('/login');
      }
       else {
        setUser(userInfo);
      }

      initialLoad.current = false;
    }
  }, [navigate, location.pathname]);


  useEffect(() => {
  console.log('User state updated:', user);
}, [user]);


  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const ChatState = () => {
  return useContext(ChatContext);
};

export { ChatProvider, ChatState };
