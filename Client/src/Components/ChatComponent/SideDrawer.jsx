import React, { useState } from 'react';
import {
  Box,
  Tooltip,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaSearch } from 'react-icons/fa';
import { ChatState } from '../../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import "../../Styles/SideDrawer.css"; // Import the CSS file
import ProfileModal from '../Miscllaneous/ProfileModal';
import { useToast } from '@chakra-ui/react';
import ChatLoading from './ChatLoading'
import UserListItem from '../Avatar/UserListItem';
import axios from 'axios';
import { getSender } from '../../config/ChatLogic';
import { Badge } from '@chakra-ui/react';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { setSelectedChat,
    user,
    chats,
    setUser,
    setChats,
    notification,
    setNotification
  } = ChatState();

    
 
 let imgsrc = user?.pic;
if (imgsrc?.includes('public')) {
  imgsrc = `api/${imgsrc.replace(/\\/g, "/").replace("public", "")}`;
}


  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();



  if (!user) {
    return <Text>Loading user...</Text>; // Fallback if user is not available
  }

  const logoutHandler = () => {
    localStorage.removeItem('user-info');
    setUser(null);
    navigate('/login');
  };




  
 const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    console.log(search);
    
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`api/user?search=${search}`, config);
      // console.log(data);
      
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description:`Failed to Load the Search Result ${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };





  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log("hiii");
      

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } 
    
    catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };











  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="transparent" // Remove default background since it's handled in CSS
        w="100%"
        p="5px 10px"
        borderColor={'#00cc00'}
        borderBottom="1px solid #fff" // Added bottom border
        color="black"
        borderRadius={'0px'}
        className="side-drawer" // Added class for styling
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom" className="tooltip">
          <Button variant="ghost" className="menu-button" onClick={onOpen}>
            <FaSearch color={'#00cc00'} />
            <Text display={{ base: 'none', md: 'flex' }} px="4" color={'#00cc00'}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="3xl" fontFamily="Work sans" color={'#00cc00'}>
          Durbhash
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
            <Badge count={notification.length} colorScheme="red"></Badge>

  <BellIcon fontSize="2xl" m={1} color={'#00cc00'} />

            </MenuButton>
            <MenuList className="menu">
             {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem className='menu item'
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}   
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} className="menu-button">
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={imgsrc}
                className="avatar" // Avatar class
              />
            </MenuButton>

            <MenuList className="menu">
              <ProfileModal user={user}>
                <MenuItem className="menu-item">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider className="menu-divider" />
              <MenuItem className="menu-item" onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Drawer Component */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pr={2}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} ml={2} bg="#00cc00" color="white" >
                Go
              </Button>
            </Box>
             {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
