import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

function ChatComponent({ messages, setMessages }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim(), type: 'text' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages
      .filter((msg) => msg.type === 'text')
      .map((msg) => ({ role: msg.role, content: msg.content }));
    const chatMessages = [...history, { role: 'user', content: userMessage.content }];

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: chatMessages,
        }),
      });

      if (!response.ok) throw new Error(`OpenRouter API Error: ${response.status}`);
      const data = await response.json();
      const botMessage = {
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'No response from AI.',
        type: 'text',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${error.message}`, type: 'text' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-layout h-full flex-col relative">
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <h2>Start a conversation</h2>
            <p>Type a message to chat with the AI.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className="message-content">
              <div className={`avatar ${msg.role}`}>
                {msg.role === 'user' ? <User size={18} color="white" /> : <Bot size={18} color="white" />}
              </div>
              <div className="message-inner">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper assistant">
             <div className="message-content">
               <div className="avatar assistant"><Bot size={18} color="white" /></div>
               <div className="message-inner">
                 <div className="typing-indicator">
                   <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                 </div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area-wrapper">
        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="action-btn primary" disabled={isLoading || !input.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
export default ChatComponent;
