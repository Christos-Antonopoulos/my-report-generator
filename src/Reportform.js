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

    // Update form state based on input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
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
            <ReactQuill theme="snow" value={report} readOnly />
        </div>
    );
};

export default ReportForm;
