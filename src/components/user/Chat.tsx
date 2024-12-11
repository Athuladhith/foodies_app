


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Headder from './Headder';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}

interface ChatMessage {
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const storedUser = localStorage.getItem('user');
  const loggedInUserId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
   
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/restaurant/${id}`);
        setRestaurantName(response.data.restaurantName);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast.error('Could not fetch restaurant details.');
      }
    };

    fetchRestaurant();
  }, [id]);

  useEffect(() => {

    const createConversation = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/users/conversations', {
          restaurantId: id,
          userId: loggedInUserId,
        });
        setConversationId(response.data._id);
      } catch (error) {
        console.error('Error creating conversation:', error);
        toast.error('Could not create conversation.');
      }
    };

    createConversation();
  }, [id, loggedInUserId]);

  useEffect(() => {
   
    if (conversationId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/messages/${conversationId}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
          toast.error('Could not load messages.');
        }
      };

      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      socket.on('receive', (message: ChatMessage) => {
        console.log(message, 'data from the restaurant');
        if (conversationId === message.conversationId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }
  }, [conversationId]);


  useEffect(() => {
    if (loggedInUserId) {
      console.log('enterrd to the useeffect')
      socket.emit('userStatusUpdate', { userId: loggedInUserId, isActive: true });


      return () => {
        socket.emit('userStatusUpdate', { userId: loggedInUserId, isActive: false });
      };
    }
  }, [loggedInUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    const messageData = {
      conversationId,
      senderId: loggedInUserId,
      message: newMessage,
    };
    const notification = {
      conversationId,
      senderId: loggedInUserId,
      content: newMessage,
    };

  
    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: loggedInUserId!, content: newMessage, timestamp: new Date().toISOString() },
    ]);
    setNewMessage('');

    try {
      await axios.post('http://localhost:5000/api/users/messages', messageData);
      socket.emit('sendMessage', notification); 
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Could not send message.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Headder />
      <div className="flex-1 flex flex-col items-center bg-gray-100 p-4">
        <h2 className="text-xl font-semibold text-center mb-4">{restaurantName} Chat</h2>
        <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md overflow-auto h-96">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  message.senderId === loggedInUserId ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl flex mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-l-md"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatPage;


