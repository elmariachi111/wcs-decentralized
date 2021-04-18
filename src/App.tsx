import { extendTheme, ChakraProvider, Container } from "@chakra-ui/react"
import React from 'react';
import AttendeeApp from './components/AttendeeApp';
import { IPFSProvider } from './ipfs.context';

const customTheme = extendTheme({ config: {
  initialColorMode: "dark"
} })

const App: React.FC = () => {
  
  return (
    <ChakraProvider theme={customTheme}>
      <IPFSProvider>
        <Container maxW="xl">
          <AttendeeApp />
        </Container>
      </IPFSProvider>
    </ChakraProvider>
  );
}

export default App;
