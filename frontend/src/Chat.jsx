import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function Chat() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // SESSION GENERATE
  useEffect(() => {

    let id = localStorage.getItem("sessionId");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("sessionId", id);
    }

    fetchConversation(id);

  }, []);

  // FETCH OLD CHAT
  const fetchConversation = async (id) => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/conversations/${id}`
      );

      setMessages(res.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  // SEND MESSAGE
  const sendMessage = async () => {

    if (!input.trim()) return;

    const sessionId = localStorage.getItem("sessionId");
    const userMessage = input;

    const userMsg = {
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          sessionId,
          message: userMessage
        }
      );

      const aiMsg = {
        role: "assistant",
        content: res.data.reply,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch {

      const errorMsg = {
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMsg]);

    } finally {
      setLoading(false);
    }

  };

  // ENTER KEY
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // NEW CHAT
  const newChat = () => {

    const newId = crypto.randomUUID();
    localStorage.setItem("sessionId", newId);
    setMessages([]);

  };

  // FORMAT TIME
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        <h2>🤖 AI Support Assistant</h2>

        <button
          onClick={newChat}
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            cursor: "pointer"
          }}
        >
          New Chat
        </button>
      </div>

      <div className="chat-box" ref={chatBoxRef}>

        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role}`}>
            <div className="message-content">
              {msg.content}
              <div style={{ fontSize: "10px" }}>
                {formatTime(msg.created_at)}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-wrapper assistant">
            <div>Loading...</div>
          </div>
        )}

      </div>

      <div className="chat-input-section">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>
  );
}

export default Chat;