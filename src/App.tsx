import React from 'react';
import AttendeeApp from './components/AttendeeApp';
import './css/App.css';
import { IPFSProvider } from './ipfs.context';

const App: React.FC = () => {

  return (
    <IPFSProvider>
      <div className="App">
        <AttendeeApp />
      </div>
    </IPFSProvider>
  );
}

export default App;
