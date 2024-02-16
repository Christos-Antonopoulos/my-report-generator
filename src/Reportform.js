// ReportForm.js
import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import quill styles

const ReportForm = () => {
    // Initialize form state with all fields
    const [formValues, setFormValues] = useState({
        student_name: '',
        gender: '',
        class_behavior: '',
        strengths: '',
        year_group: '',
        subject: '',
        academic_performance: '',
        areas_of_development: '',
        tone: '',
        report_length: '' // Keeping it empty to allow user input
    });

    // State for the generated report
    const [report, setReport] = useState('');
    const [detailedReport, setDetailedReport] = useState(''); // New state for the detailed report
    const [lastSavedStructure, setLastSavedStructure] = useState('');
    const [lastSavedReport, setLastSavedReport] = useState('');
    // const handleReportChange = (content) => {
    //     setReport(content);
    // };
    // const handleDetailedReportChange = (content) => {
    //     setDetailedReport(content);
    const handleStructureChange = (content) => {
        setReport(content); // Update the current structure state
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
            const detailedResponse = await axios.post('http://127.0.0.1:5000/generate_detailed_report', {
                structure: report, // The structure obtained from the first API call
                // Include other formValues that are needed to generate the detailed report
                ...formValues
            });
            setDetailedReport(detailedResponse.data.detailedReport);
        } catch (error) {
            console.error('Error generating the detailed report:', error);
        }
    };

    const handleRegenerateReport = async () => {
        try {
            const dataToSend = {
                last_saved_structure: lastSavedStructure,
                last_saved_report: lastSavedReport,
                current_structure: report,
                current_report: detailedReport,
            };
            const response = await axios.post('http://127.0.0.1:5000/regenerate_detailed_report', {
                last_saved_structure: lastSavedStructure,
                last_saved_report: lastSavedReport,
                current_structure: report, // The current content of the first editor
                current_report: detailedReport, // The current content of the second editor
            });

            // Update the content of the text editors with the regenerated report
            //setReport(response.data.updatedDetailedReport); // tjat was a mistake 
            setDetailedReport(response.data.updatedDetailedReport);
        } catch (error) {
            console.error('Error regenerating the report:', error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            // Post form data to the backend and set the generated report in state
            const response = await axios.post('http://127.0.0.1:5000/generate_report ', formValues);
            setReport(response.data.report);
        } catch (error) {
            console.error('Error generating the report:', error);
        }
        await handleDetailedReportGeneration();
    };
    

    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="student_name"
                    placeholder="Student Name"
                    value={formValues.student_name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={formValues.gender}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="class_behavior"
                    placeholder="Class Behavior"
                    value={formValues.class_behavior}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="strengths"
                    placeholder="Strengths"
                    value={formValues.strengths}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="year_group"
                    placeholder="Year Group"
                    value={formValues.year_group}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formValues.subject}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="academic_performance"
                    placeholder="Academic Performance"
                    value={formValues.academic_performance}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="areas_of_development"
                    placeholder="Areas of Development"
                    value={formValues.areas_of_development}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="tone"
                    placeholder="Tone"
                    value={formValues.tone}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="report_length"
                    placeholder="Report Length (words)"
                    value={formValues.report_length}
                    onChange={handleChange}

                />
                <button type="submit">Generate Report</button>
            </form>
            <div className="editors-container">
                <div className="editor">
                    <ReactQuill theme="snow" value={report} onChange={(content) => setReport(content) } />

                </div>
                <div className="editor">
                <ReactQuill theme="snow" value={detailedReport} onChange={(content) => setDetailedReport(content)}  />

                </div>
                </div>
                <button onClick={handleRegenerateReport}>Regenerate Full Report</button>

            
            
            
            
            
        </div>
    );    
};

export default ReportForm;
