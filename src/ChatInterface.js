// In ChatInterface.js
import React from "react";
import axios from "axios";
import { collection, doc, addDoc } from "firebase/firestore";
import { db } from "./App";

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

const ChatInterface = ({ sessionId }) => {
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
          await addDoc(collection(db, "chatSessions"), {
            sessionId: sessionId,
            userInput: input,
            botResponse: botResponse,
            timeStamp: new Date(),
          })
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
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
          marginBottom: 5,
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Box>
                <ListItemText
                  primary={message.sender === "user" ? "You" : "AI"}
                  secondary={<React.Fragment>{message.text}</React.Fragment>}
                  sx={{ wordWrap: "break-word" }}
                />
              </Box>
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
          minRows={2}
          multiline
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
