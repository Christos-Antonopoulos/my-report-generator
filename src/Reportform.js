// ReportForm.js
import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import quill styles
import { Box, Button, TextField } from "@mui/material";

const ReportForm = () => {
  // Initialize form state with all fields
  const [formValues, setFormValues] = useState({
    student_name: "",
    gender: "",
    class_behavior: "",
    strengths: "",
    year_group: "",
    subject: "",
    academic_performance: "",
    areas_of_development: "",
    tone: "",
    report_length: "", // Keeping it empty to allow user input
  });

  // State for the generated report
  const [structure, setStructure] = useState("");
  const [detailedReport, setDetailedReport] = useState(""); // New state for the detailed report
  const [lastSavedStructure, setLastSavedStructure] = useState("");
  const [lastSavedReport, setLastSavedReport] = useState("");
  // const handleReportChange = (content) => {
  //     setReport(content);
  // };
  // const handleDetailedReportChange = (content) => {
  //     setDetailedReport(content);
  const handleStructureChange = (content) => {
    setStructure(content); // Update the current structure state
  };

  // Handler for changes in the full report text editor (Editor 2)
  const handleReportChange = (content) => {
    setDetailedReport(content); // Update the current report state
  };

  // Update form state based on input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // New function to handle detailed report generation
  const handleDetailedReportGeneration = async () => {
    try {
      const detailedResponse = await axios.post(
        "http://127.0.0.1:5000/generate_detailed_report",
        {
          structure: structure, // The structure obtained from the first API call
          // Include other formValues that are needed to generate the detailed report
          ...formValues,
        }
      );
      const formattedDetailedReport =
        detailedResponse.data.detailedReport.replace(/\n/g, "<br>");

      setDetailedReport(formattedDetailedReport);
      //setDetailedReport(detailedResponse.data.detailedReport);

      console.log("Ive been executed (detailed report)");
      setLastSavedReport(detailedReport);
    } catch (error) {
      console.error("Error generating the detailed report:", error);
    }
  };

  const handleRegenerateReport = async () => {
    try {
      setLastSavedReport(detailedReport);
      setLastSavedStructure(structure);

      const dataToSend = {
        last_saved_structure: lastSavedStructure,
        last_saved_report: lastSavedReport,
        current_structure: structure,
        current_report: detailedReport,
      };
      const response = await axios.post(
        "http://127.0.0.1:5000/regenerate_detailed_report",
        {
          last_saved_structure: lastSavedStructure,
          last_saved_report: lastSavedReport,
          current_structure: structure, // The current content of the first editor
          current_report: detailedReport, // The current content of the second editor
        }
      );

      // Update the content of the text editors with the regenerated report
      //setReport(response.data.updatedDetailedReport); // tjat was a mistake
      setDetailedReport(response.data.updatedDetailedReport);
    } catch (error) {
      console.error("Error regenerating the report:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Post form data to the backend and set the generated report in state
      const response = await axios.post(
        "http://127.0.0.1:5000/generate_report ",
        formValues
      );
      const formattedStructure = response.data.report.replace(/\n/g, "<br>");

      setStructure(formattedStructure);
      //setStructure(response.data.report);
      console.log("Ive been executed Structure");
      setLastSavedStructure(formattedStructure);
    } catch (error) {
      console.error("Error generating the report:", error);
    }
    await handleDetailedReportGeneration();
  };

  return (
    <Box>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Box sx={{ margin: "auto" }}>
          <TextField
            label="Student Name"
            type="text"
            name="student_name"
            value={formValues.student_name}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Gender"
            type="text"
            name="gender"
            value={formValues.gender}
            onChange={handleChange}
            variant="outlined"
          />
          {/* Repeat for other inputs */}
          <TextField
            label="Year Group"
            type="text"
            name="year_group"
            value={formValues.year_group}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>
        <Box sx={{ margin: "auto" }}>
          <TextField
            label="Subject"
            type="text"
            name="subject"
            value={formValues.subject}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Academic Performance"
            type="text"
            name="academic_performance"
            value={formValues.academic_performance}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Areas of Development"
            type="text"
            name="areas_of_development"
            value={formValues.areas_of_development}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>
        <Box sx={{ margin: "auto" }}>
          <TextField
            label="Strengths"
            type="text"
            name="strengths"
            value={formValues.strengths}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Class Behavior"
            type="text"
            name="class_behavior"
            value={formValues.class_behavior}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Tone"
            type="text"
            name="tone"
            value={formValues.tone}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Report Length (words)"
            type="number"
            name="report_length"
            value={formValues.report_length}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>
        <Button
          variant="contained"
          type="submit"
          sx={{ margin: "auto", top: "15px", marginBottom: "15px" }}
        >
          Generate Report
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          maxWidth: "90%",
          minHeight: "400px",
          paddingTop: "15px",
          margin: "auto",
        }}
      >
        <Box sx={{ flex: "1", height: "400px" }}>
          <ReactQuill
            style={{ height: "350px" }}
            theme="snow"
            value={structure}
            onChange={(content) => setStructure(content)}
          />
        </Box>
        <Box sx={{ flex: "1" }}>
          <ReactQuill
            style={{ height: "350px" }}
            theme="snow"
            value={detailedReport}
            onChange={(content, delta, source, editor) => {
              const formattedContent = content.replace(/\n/g, "<br>");
              // Log the content of the editor after change
              console.log(formattedContent);
              // If you also want to log the actual changes (deltas)
              console.log(delta);
              // Update the state with the new content
              // setDetailedReport(content);
              setDetailedReport(formattedContent);
            }}
            //onChange={(content) => setDetailedReport(content)}
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        type="submit"
        sx={{ margin: "auto", top: "15px", marginBottom: "15px" }}
        onClick={handleRegenerateReport}
      >
        Regenerate Full Report
      </Button>
    </Box>
  );
};

export default ReportForm;
