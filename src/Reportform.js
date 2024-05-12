// ReportForm.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { collection, doc, addDoc } from "firebase/firestore";
import { db } from "./App";

const Diff = require("diff");

function extractTextFromHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}

const ReportForm = ({ sessionId }) => {
  const [structure, setStructure] = useState("");
  const [detailedReport, setDetailedReport] = useState(""); // New state for the detailed report
  const [lastSavedStructure, setLastSavedStructure] = useState("");
  const [lastSavedReport, setLastSavedReport] = useState("");
  const [reportWithChanges, setReportWithChanges] = useState("");
  const [structureLoading, setStructureLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [showChanges, setShowChanges] = useState(false);
  const [lastSavedDate, setLastSavedDate] = useState(new Date());

  const quillRef = useRef(null);
  const structureRef = useRef(null);
  // Initialize form state with all fields
  const [formValues, setFormValues] = useState({
    student_name: "leo",
    gender: "male",
    class_behavior: "good",
    strengths: "smart",
    year_group: "",
    subject: "algorithms",
    academic_performance: "poor",
    areas_of_development: "dynamic programming",
    tone: "formal",
    report_length: "200", // Keeping it empty to allow user input
  });

  const highlightDifferences = async (
    lastSavedStructure,
    structure,
    last_saved_report,
    oldText,
    newText
  ) => {
    const diff = Diff.diffWords(oldText, newText);
    const diff2 = Diff.diffChars(
      lastSavedReport.replace(/<br>/g, ""),
      oldText.replace(/\n/g, "")
    );

    const diff3 = Diff.diffChars(
      lastSavedStructure.replace(/<br>/g, ""),
      structure.replace(/<br>/g, "")
    );
    console.log("diff3", diff3);

    const totalReportAdditions = diff2.reduce((acc, part) => {
      return acc + (part.added ? part.count : 0);
    }, 0);
    const totalReportDeletions = diff2.reduce((acc, part) => {
      return acc + (part.removed ? part.count : 0);
    }, 0);

    const totalStructureAdditions = diff3.reduce((acc, part) => {
      return acc + (part.added ? part.count : 0);
    }, 0);

    const totalStructureDeletions = diff3.reduce((acc, part) => {
      return acc + (part.removed ? part.count : 0);
    }, 0);

    const to_ret = diff
      .map((part) => {
        if (part.added) {
          return `<span style="background-color: #ddffdd;">${part.value}</span>`;
        } else if (part.removed) {
          return `<span style="background-color: #ffdddd;">${part.value}</span>`;
        }
        return part.value;
      })
      .join("");

    const to_ret2 = diff2
      .map((part) => {
        if (part.added) {
          return `<span style="background-color: #ddffdd;">${part.value}</span>`;
        } else if (part.removed) {
          return `<span style="background-color: #ffdddd;">${part.value}</span>`;
        }
        return part.value;
      })
      .join("");

    const to_ret3 = diff3
      .map((part) => {
        if (part.added) {
          return `<span style="background-color: #ddffdd;">${part.value}</span>`;
        } else if (part.removed) {
          return `<span style="background-color: #ffdddd;">${part.value}</span>`;
        }
        return part.value;
      })
      .join("");

    const newDate = new Date();
    const timeDiff = newDate - lastSavedDate;
    setLastSavedDate(newDate);

    await addDoc(collection(db, "reports"), {
      sessionId: sessionId,
      currentStructure:
        totalStructureAdditions !== 0 || totalStructureDeletions !== 0
          ? to_ret3
          : "",
      lastSavedStructure: lastSavedStructure,
      rawStucture: extractTextFromHTML(to_ret3),
      timeSincePreviousGeneration: timeDiff,
      timeStamp: newDate,
      regenaretedReport: to_ret,
      reportBeforeUserChanges: last_saved_report,
      reportAfterUserChanges:
        totalReportAdditions !== 0 || totalReportDeletions !== 0 ? to_ret2 : "",
      rawRegeneratedReport: extractTextFromHTML(to_ret),
      userReportAdditions: totalReportAdditions,
      userReportDeletions: totalReportDeletions,
      userStructureAdditions: totalStructureAdditions,
      userStructureDeletions: totalStructureDeletions,
    })
      .then((docRef) => {
        //console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    return to_ret.replace(/\n/g, "<br>");
  };

  // State for the generated report

  const downloadReport = () => {
    const blob = new Blob([showChanges ? reportWithChanges : detailedReport], {
      type: "text/html",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.html"; // Specify the file name
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Free up resources
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const undoChanges = () => {
    setShowChanges(false);
    setDetailedReport(lastSavedReport);
  };
  const handleShowChanges = () => {
    setShowChanges(!showChanges);
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
        detailedResponse.data.detailedReport?.replace(/\n/g, "<br>");

      setLastSavedDate(new Date());
      setDetailedReport(formattedDetailedReport);
      setLastSavedReport(formattedDetailedReport);
    } catch (error) {
      console.error("Error generating the detailed report:", error);
    }
  };

  const handleRegenerateReport = async () => {
    const editorText = quillRef.current.getEditor().getText();
    setLastSavedStructure(structure);
    setReportLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/regenerate_detailed_report",
        {
          last_saved_structure: lastSavedStructure,
          last_saved_report: lastSavedReport,
          current_structure: structure, // The current content of the first editor
          current_report: editorText, // The current content of the second editor
        }
      );

      // Update the content of the text editors with the regenerated report
      console.log("response", response.data.updatedDetailedReport);
      setReportWithChanges(
        await highlightDifferences(
          lastSavedStructure,
          structure,
          lastSavedReport,
          editorText,
          response.data.updatedDetailedReport
        )
      );
      setDetailedReport(
        response?.data?.updatedDetailedReport?.replace(/\n/g, "<br>")
      );
      setLastSavedReport(
        response?.data?.updatedDetailedReport?.replace(/\n/g, "<br>")
      );
    } catch (error) {
      console.error("Error regenerating the report:", error);
    }

    setReportLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    setReportLoading(true);
    setStructureLoading(true);

    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Post form data to the backend and set the generated report in state
      const response = await axios.post(
        "http://127.0.0.1:5000/generate_report ",
        formValues
      );
      const formattedStructure = response.data.report.replace(/\n/g, "<br>");

      setStructure(formattedStructure);
      setStructureLoading(false);
      setLastSavedStructure(formattedStructure);
    } catch (error) {
      console.error("Error generating the report:", error);
    }
    await handleDetailedReportGeneration();

    setReportLoading(false);
  };

  //

  //

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
        <Button
          onClick={downloadReport}
          variant="contained"
          sx={{ margin: "auto", top: "15px", marginBottom: "15px" }}
        >
          Save Report
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
        <Box sx={{ flex: 1, height: "400px", maxWidth: "50%" }}>
          {structureLoading && (
            <CircularProgress
              sx={{ position: "absolute", left: "25%", top: "80%" }}
            />
          )}
          <ReactQuill
            ref={structureRef}
            style={{ height: "350px" }}
            theme="snow"
            value={structureLoading ? "" : structure}
            onChange={(content, delta, source, editor) => {
              setStructure(content);
              if (
                source === "user" &&
                delta?.ops[1]?.delete === undefined &&
                delta.ops[0].retain
              ) {
                const index = delta.ops[0].retain;
                const quill = structureRef.current.getEditor();

                quill.formatText(index, 1, "color", "blue");
              }
            }}
          />
        </Box>
        <Box sx={{ flex: 1, maxWidth: "50%" }}>
          {reportLoading && (
            <CircularProgress
              sx={{ position: "absolute", right: "25%", top: "80%" }}
            />
          )}

          <ReactQuill
            ref={quillRef}
            style={{ height: "350px" }}
            theme="snow"
            value={
              !reportLoading
                ? showChanges && reportWithChanges !== ""
                  ? reportWithChanges
                  : //: detailedReport?.replace(/\n/g, "<br>")
                    detailedReport
                : ""
            }
            onChange={(content, delta, source, editor) => {
              //!showChanges && setDetailedReport(content);
              if (
                source === "user" &&
                delta?.ops[1]?.delete === undefined &&
                delta.ops[0].retain
              ) {
                const index = delta.ops[0].retain;
                const quill = quillRef.current.getEditor();

                quill.formatText(index, 1, "color", "blue");
              }
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          type="submit"
          sx={{ margin: "auto", top: "15px", marginBottom: "15px" }}
          onClick={handleRegenerateReport}
        >
          Regenerate Full Report
        </Button>
        {reportWithChanges !== "" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: 500,
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{
                margin: "auto",
                top: "15px",
                marginBottom: "15px",
                width: 200,
              }}
              onClick={handleShowChanges}
            >
              {showChanges ? "Hide Changes" : "Show Changes"}
            </Button>
            {lastSavedReport !== detailedReport && (
              <Button
                variant="contained"
                type="submit"
                sx={{
                  margin: "auto",
                  top: "15px",
                  marginBottom: "15px",
                  width: 200,
                }}
                onClick={undoChanges}
              >
                undo changes
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportForm;
