import './App.css';
import { Route, Routes } from "react-router-dom";
import Homepage from './Pages/HomePage';
import ChatsPage from './Pages/ChatsPage';
import React, { useEffect } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import axios from 'axios';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

function App() {

  const fetchData = async () => {
    const { data } = await axios.get('/api/aa');
    console.log(data);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/chats' element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
