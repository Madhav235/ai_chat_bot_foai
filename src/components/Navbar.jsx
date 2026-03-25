import React from 'react';

function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="navbar">
      <div className="toggle-container">
        <div 
          className={`slider-bg ${activeTab === 'image' ? 'right' : 'left'}`}
        />
        <button 
          className={`toggle-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={`toggle-btn ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          Generate Image
        </button>
      </div>
    </div>
  );
}

export default Navbar;
