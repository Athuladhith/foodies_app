

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import MainLayout from './Mainlayout';

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}
interface Messages {
  senderId: string;
  content: string;
  timestamp: string;
  conversationId: string;
}
interface ActiveUsers {
  [userId: string]: boolean;
}

const socket = io('http://localhost:5000');

const RestaurantChatPage: React.FC = () => {
  const restaurantId = localStorage.getItem('restaurantid');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUsers>({});

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/restaurant/conversations/${restaurantId}`
        );
        setConversations(response.data);
        if (response.data.length > 0) {
          setConversationId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [restaurantId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/restaurant/messages/${conversationId}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
          toast.error('Could not load messages');
        }
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      socket.on('receiveMessage', (message: Messages) => {
        if (conversationId === message.conversationId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    socket.on('userStatusUpdate', (statusUpdate: { userId: string; isActive: boolean }) => {
      setActiveUsers((prev) => ({ ...prev, [statusUpdate.userId]: statusUpdate.isActive }));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userStatusUpdate');
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messagePayload = {
      conversationId,
      senderId: restaurantId,
      message: newMessage,
    };

    const data = {
      conversationId,
      senderId: restaurantId,
      content: newMessage,
    };

    try {
      await axios.post('http://localhost:5000/api/restaurant/message', messagePayload);
      socket.emit('send', data);
      setNewMessage('');
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: restaurantId!, content: newMessage, timestamp: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setConversationId(conversationId);
  };

  return (
    <MainLayout>
      <div className="h-screen flex bg-gray-100">
      
        <div className="w-1/3 bg-white border-r">
          <header className="bg-green-600 text-white p-4 font-bold ">
            Conversations
          </header>
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                className="p-4 hover:bg-gray-200 cursor-pointer flex items-center"
                onClick={() => handleSelectConversation(conversation._id)}
              >
                <p className="font-medium text-gray-800 mr-2">{conversation.userId.name}</p>
                {activeUsers[conversation.userId._id] && (
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>


        <div className="flex flex-col flex-grow">
          <header className="bg-green-600 text-white p-4 flex items-center">
            <p className="font-bold">Chat</p>
          </header>

   
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.senderId === restaurantId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      message.senderId === restaurantId
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-500 block mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
            )}
          </div>

 
          <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 bg-white border-t">
            <input
              type="text"
              className="flex-grow p-2 border rounded-lg outline-none"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </MainLayout>
  );
};

export default RestaurantChatPage;
