import React from 'react';
import './App.css';
// import ReportForm from '/Users/christosantonopoulos/Desktop/my-report-generator/src/Reportform'; // Import the ReportForm component
import ReportForm from './Reportform'; //  ReportForm.js is in the same directory as App.js


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Remove the default content and replace it with the ReportForm component */}
        <ReportForm /> 
      </header>
    </div>
  );
}

export default App;

// This is the main file feeding the apps frontend, npm start the thing in the terminal 