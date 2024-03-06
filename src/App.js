import React, { useState } from "react";
import "./App.css";
// import ReportForm from '/Users/christosantonopoulos/Desktop/my-report-generator/src/Reportform'; // Import the ReportForm component
import ReportForm from "./Reportform"; //  ReportForm.js is in the same directory as App.js

import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RichTextEditor from "./RichTextEditor";
import ChatInterface from "./ChatInterface";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab
            label="Rich Text Editor"
            sx={{
              "&.Mui-selected": {
                color: "white", // or any color that stands out from the AppBar color
              },
            }}
          />

          <Tab
            label="Chat Interface"
            sx={{
              "&.Mui-selected": {
                color: "white", // or any color that stands out from the AppBar color
              },
            }}
          />
          <Tab
            label="New Interface"
            sx={{
              "&.Mui-selected": {
                color: "white", // or any color that stands out from the AppBar color
              },
            }}
          />
        </Tabs>
      </AppBar>
      {selectedTab === 0 && <RichTextEditor />}
      {selectedTab === 1 && <ChatInterface />}
      {selectedTab === 2 && <ReportForm />}
    </Box>
  );
}

export default App;

// This is the main file feeding the apps frontend, npm start the thing in the terminal
