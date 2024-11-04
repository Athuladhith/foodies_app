import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toast notifications
import 'tailwindcss/tailwind.css'; // Ensure Tailwind CSS is properly set up

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get restaurant ID from URL
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const storedUser = localStorage.getItem('userdetails');
  let userName = 'Guest'; // Default to "Guest" if no user is found

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser); // Parse the JSON string
      userName = parsedUser.name || 'Guest'; // Use the name if it exists, fallback to "Guest"
    } catch (error) {
      console.error('Error parsing user details from localStorage:', error);
    }
  }
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/restaurant/${id}`);
        setRestaurantName(response.data.restaurantName);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };

    fetchRestaurant();
  }, [id]);

  const createConversation = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/conversations', {
        restaurantId: id,
        userId: JSON.parse(storedUser || '{}')._id, // Get userId from localStorage
      });
      setConversationId(response.data._id); // Set the conversationId from the response
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Could not create conversation');
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }

    const message: Message = {
      sender: userName,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Update messages with the new one
    setMessages((prevMessages) => [...prevMessages, message]);

    try {
      await axios.post('http://localhost:5000/api/messages', {
        conversationId: conversationId,
        senderId: JSON.parse(storedUser || '{}')._id, // Get userId from localStorage
        message: newMessage,
      });
      setNewMessage(''); // Clear the input field
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Could not send message');
    }
  };
  useEffect(() => {
    createConversation();
  }, [id]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">{restaurantName ? `Chat with ${restaurantName}` : 'Loading...'}</h1>
        <span className="text-sm">You are logged in as {userName}</span>
      </header>

      {/* Chat Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`mb-4 flex ${message.sender === userName ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-xs ${message.sender === userName ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                <p className="font-medium">{message.sender}</p>
                <p>{message.content}</p>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        )}
      </div>

      {/* Chat Input */}
      <div className="bg-white p-4 flex items-center">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ChatPage;
