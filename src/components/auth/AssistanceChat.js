import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../css/AssistanceChat.css";

function AssistanceChat({ language }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const userId = window.sessionStorage.getItem("USER_ID");
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        if (userId) {
          setIsLoggedIn(true);
          setErrorMessage("");
          fetchChatHistory();
        } else {
          setIsLoggedIn(false);
          setErrorMessage(language === 'es' ? "Inicia sesión para enviar mensajes en el chat de asistencia." : "Log in to send messages in the assistance chat.");
        }
      } catch (error) {
        console.error("Error checking if user is logged in:", error);
        setIsLoggedIn(false);
        setErrorMessage(language === 'es' ? "Error al verificar el estado de inicio de sesión." : "Error checking login status.");
      }
    };
  
    checkLoggedIn();
  }, [userId, language]);

  useEffect(() => {
    scrollToBottom();
  }, [isMinimized]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/messages/assistance/history/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setErrorMessage(language === 'es' ? "No se permiten mensajes vacíos." : "Empty messages are not allowed.");
      return;
    }

    try {

      await axios.post(`http://localhost:8080/messages/assistance/send/${userId}`, {
        userId: userId,
        messageText: newMessage.substring(0, 150), 
      });
      setNewMessage("");
      setErrorMessage("");
      fetchChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`assistance-chat-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="assistance-chat-header" onClick={toggleMinimize}>{language === 'es' ? "Asistencia Chat" : "Assistance Chat"}</div>
      <div className="error-container"> 
        {!isLoggedIn && (
          <p className="error-message-chat">{errorMessage}</p>
        )}
      </div>
      {!isMinimized && (
        <div>
          <div className="assistance-chat-body">
            {messages.map((message) => (
              <div key={message.chatId}>
                <strong>{message.nickname}:</strong> {message.messageText}
              </div>
            ))}
            <div ref={messagesEndRef} /> 
          </div>
          <div className="assistance-chat-footer">
            {isLoggedIn && (
              <div>
                <input
                  onKeyPress={handleKeyPress}
                  type="text"
                  value={newMessage}
                  maxLength={150} 
                  placeholder={language === 'es' ? "Escribe aquí para chatear..." : "Type here to chat..."}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage} className="small-button">{language === 'es' ? "Enviar" : "Send"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AssistanceChat;
