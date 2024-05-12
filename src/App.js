import React, { useEffect, useState } from "react";
import "./App.css";
// import ReportForm from '/Users/christosantonopoulos/Desktop/my-report-generator/src/Reportform'; // Import the ReportForm component
import ReportForm from "./Reportform"; //  ReportForm.js is in the same directory as App.js

import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RichTextEditor from "./RichTextEditor";
import ChatInterface from "./ChatInterface";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg20AICcCtC-UM-6enLaOBEEMc3F8vQP8",
  authDomain: "masters-final.firebaseapp.com",
  projectId: "masters-final",
  storageBucket: "masters-final.appspot.com",
  messagingSenderId: "1028124114117",
  appId: "1:1028124114117:web:343eed2efa72668c1684ac",
  measurementId: "G-1CSG5HGK3F",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

function App() {
  const [selectedTab, setSelectedTab] = useState(2);
  const [report, setReport] = useState("");
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const fetchSessionId = async () => {
      const reportRef = collection(db, "reports");
      const q = query(reportRef, orderBy("sessionId", "desc"), limit(1)); // Query for the document with the highest sessionId
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Found at least one document, increment the sessionId for the new document
        const highestSessionId = querySnapshot.docs[0].data().sessionId;
        setSessionId(highestSessionId + 1);
      } else {
        // No documents found, start from 1
        setSessionId(1);
      }
    };
    fetchSessionId();
  }, [db]);

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
      {selectedTab === 0 && <RichTextEditor report={report} />}
      {selectedTab === 1 && <ChatInterface sessionId={sessionId} />}
      {selectedTab === 2 && (
        <ReportForm setReport={setReport} sessionId={sessionId} />
      )}
    </Box>
  );
}

export default App;
