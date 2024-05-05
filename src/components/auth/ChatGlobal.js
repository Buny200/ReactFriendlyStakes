import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../css/ChatGlobal.css";

function ChatGlobal() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
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
          setErrorMessage("Inicia sesión para enviar mensajes en el chat de asistencia.");
        }
      } catch (error) {
        console.error("Error checking if user is logged in:", error);
        setIsLoggedIn(false);
        setErrorMessage("Error al verificar el estado de inicio de sesión.");
      }
    };
  
    checkLoggedIn();
  }, [userId]);


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
      const response = await axios.get(
        "http://localhost:8080/messages/history"
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setErrorMessage("No se permiten mensajes vacíos.");
      return;
    }

    if (isSending) {
      setErrorMessage(
        "Por favor, espera unos segundos antes de enviar otro mensaje."
      );
      return;
    }

    try {
      setIsSending(true);
      await axios.post("http://localhost:8080/messages/send", {
        senderId: userId,
        messageText: newMessage.substring(0, 75), // Limita el mensaje a 50 caracteres
      });
      setNewMessage("");
      setErrorMessage("");
      setTimeout(() => setIsSending(false), 3000); // Configura el cooldown de 3 segundos
      fetchChatHistory();
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSending(false);
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
    <div className={`chat-global-container ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-global-header" onClick={toggleMinimize}>
        Chat Global
      </div>
      <div className="error-container">
        {" "}
        {/* Contenedor para el mensaje de error */}
        {!isLoggedIn && <p className="error-message-chat">{errorMessage}</p>}
      </div>
      {!isMinimized && (
        <div>
          <div className="chat-global-body">
            {messages.map((message) => (
              <div key={message.messageId}>
                <strong>{message.nickname}:</strong> {message.messageText}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-global-footer">
            {isLoggedIn && (
              <div>
                <input
                  onKeyPress={handleKeyPress}
                  type="text"
                  value={newMessage}
                  maxLength={75}
                  placeholder="Type here to chat..."
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage} className="small-button">
                  Enviar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatGlobal;
