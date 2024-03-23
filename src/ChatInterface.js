// In ChatInterface.js

import axios from "axios";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: "user" }];
      setMessages(newMessages);
      setInput("");
      try {
        const response = await axios.post("http://127.0.0.1:5000/chat", {
          input,
        });
        const botResponse = response.data.response;
        if (botResponse) {
          setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
        }
      } catch (error) {
        console.error("Error during the API call:", error);
        setMessages([
          ...newMessages,
          { text: "Error getting response from the bot.", sender: "bot" },
        ]);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={message.text}
                sx={{ wordWrap: "break-word" }}
                align={message.sender === "user" ? "right" : "left"}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          mt: 1,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          fullWidth
          label="Type your message..."
          variant="outlined"
          value={input}
          onChange={handleInputChange}
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;
