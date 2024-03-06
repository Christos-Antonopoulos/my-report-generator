// In ChatInterface.js

import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    if (message) {
      // Update conversation with the user's message
      setConversation([...conversation, { sender: "User", text: message }]);

      try {
        // Send message to backend
        const response = await axios.post("/api/chat", { message });

        // Update conversation with the response
        setConversation([
          ...conversation,
          { sender: "AI", text: response.data.message },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      // Clear the message input
      setMessage("");
    }
  };

  return (
    <Box>
      <Box>
        {/* Conversation display */}
        {conversation.map((entry, index) => (
          <p key={index}>
            <strong>{entry.sender}:</strong> {entry.text}
          </p>
        ))}
      </Box>
      <Box>
        {/* Message input */}
        <TextField
          label="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          variant="outlined"
        />
        <Button onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;
