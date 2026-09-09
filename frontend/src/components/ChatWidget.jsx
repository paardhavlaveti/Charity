import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { X, Send, MessageCircle } from 'lucide-react';
import './ChatWidget.css';

const API_URL = 'https://charity-backend-91q6.onrender.com/api';
const WS_URL = 'https://charity-backend-91q6.onrender.com/ws';

export function ChatWidget({ claimId, onClose, user }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [client, setClient] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch history and connect to WebSocket
  useEffect(() => {
    if (!claimId) return;

    // Fetch history
    axios.get(`${API_URL}/chat/${claimId}`).then((res) => {
      setMessages(res.data);
    }).catch(err => console.error("Failed to load chat history", err));

    // Initialize STOMP client
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      // Subscribe to this claim's chat room
      stompClient.subscribe(`/topic/chat/${claimId}`, (message) => {
        const newMsg = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMsg]);
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [claimId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !client || !client.connected) return;

    const chatMessage = {
      senderId: user.id,
      senderName: user.nameOrOrg,
      content: inputValue
    };

    client.publish({
      destination: `/app/chat/${claimId}`,
      body: JSON.stringify(chatMessage)
    });

    setInputValue('');
  };

  if (!claimId) return null;

  return (
    <div className="chat-widget-overlay">
      <div className="chat-header">
        <h3><MessageCircle size={18} /> Chat</h3>
        <button className="close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id || index} className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
              {!isMe && <div className="message-sender">{msg.senderName}</div>}
              <div>{msg.content}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="chat-input-area">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..." 
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
