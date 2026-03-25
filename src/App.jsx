import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChatComponent from './components/ChatComponent';
import ImageComponent from './components/ImageComponent';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="tab-content-wrapper">
        <div 
          className="tab-view" 
          style={{ display: activeTab === 'chat' ? 'block' : 'none', height: '100%' }}
        >
          <ChatComponent messages={chatMessages} setMessages={setChatMessages} />
        </div>
        
        <div 
          className="tab-view" 
          style={{ display: activeTab === 'image' ? 'flex' : 'none', height: '100%' }}
        >
          <ImageComponent images={generatedImages} setImages={setGeneratedImages} />
        </div>
      </div>
    </div>
  );
}

export default App;
