import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter here

import App from './App.jsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react'; // Import ChakraProvider
import { ChatProvider } from './Context/ChatProvider.jsx'; // Import ChatProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* Wrap everything in BrowserRouter */}
      <ChatProvider>  {/* Now ChatProvider is wrapped inside Router */}
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);
