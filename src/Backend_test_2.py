from flask import Flask, render_template, request, jsonify
import os
from openai import OpenAI
from flask import Flask, render_template, request, jsonify, current_app

from flask_cors import CORS

from flask_cors import cross_origin

app = Flask(__name__)


CORS(app)

# Replace this with your actual API key environment variable name
# Replace key with a file, exclude file from github and post in github 
#OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def generate_student_report_structure(student_name, gender, class_behavior, strengths, year_group, subject, academic_performance, areas_of_development, tone, report_length):
    """
    Generates the structure for a student performance report using the OpenAI ChatGPT API.

    :param student_name: Name of the student
    :param gender: Gender of the student
    :param class_behavior: Description of the student's behavior in class
    :param strengths: Student's strengths
    :param year_group: Year group of the student
    :param subject: Academic subject
    :param academic_performance: Description of the student's academic performance
    :param areas_of_development: Areas where the student needs to improve
    :param tone: Desired tone of the report
    :param report_length: Approximate length of the structure in words
    :return: A string containing the structure of the report
    """
    # Reuse the OpenAI client setup from the previous function
    
    #client = OpenAI(api_key=OPENAI_API_KEY)
    client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

    # Format a prompt that asks for a report structure based on the inputs
    prompt = f"Create an outline for a performance report based on the following details:\n\nStudent Name: {student_name}\nGender: {gender}\nClass Behavior: {class_behavior}\nStrengths: {strengths}\nYear Group: {year_group}\nSubject: {subject}\nAcademic Performance: {academic_performance}\nAreas of Development: {areas_of_development}\nTone: {tone}\n"

    # Call the OpenAI API
    chat_completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=report_length
    )
    
    # Access the response correctly
    response_structure = chat_completion.choices[0].message.content.strip()

    return response_structure






structure = generate_student_report_structure(
    student_name="John",
    gender="Male",
    class_behavior="Active and Focused, can be noisy sometimes",
    strengths="Great lab performance, strong understanding of circuits",
    year_group="Year 10",
    subject="Physics",
    academic_performance="Above average, especially in algebra and calculus",
    areas_of_development="Arithmetic mistakes, Handwritting",
    tone="Formal",
    report_length=250 # Adjust as needed
)




def generate_detailed_report_from_structure(structure, student_name, gender, class_behavior, strengths, year_group, subject, academic_performance, areas_of_development, tone, report_length ):
    """
    Generates a detailed student performance report based on the given structure.

    :param structure: The structure of the report as provided by generate_student_report_structure
    :param student_name: Name of the student
    :param gender: Gender of the student
    :param class_behavior: Description of the student's behavior in class
    :param strengths: Student's strengths
    :param year_group: Year group of the student
    :param subject: Academic subject
    :param academic_performance: Description of the student's academic performance
    :param areas_of_development: Areas where the student needs to improve
    :param tone: Desired tone of the report
    :param report_length: Approximate length of the structure in words
    :return: A string containing the detailed report
    """
    # Reuse the OpenAI client setup
    client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

    # Format a prompt to expand the given structure into a full report
    #prompt = f"Expand the following report structure into a detailed performance report with a {tone} tone:\n\n{structure}\n\nDetailed Report:"
    # Format a prompt to transform the given structure into a flowing, narrative-style report
    #prompt = f"Based on the following report outline, write a detailed performance report in a continuous, narrative style, maintaining a {tone} tone throughout. The report should seamlessly integrate the points from the outline into full paragraphs without using bullet points.\n\nOutline:\n{structure}\n\nNarrative Report:"

    prompt = f" Given the structure of the report provided, and the following details:\n\nStudent Name: {student_name}\nGender: {gender}\nClass Behavior: {class_behavior}\nStrengths: {strengths}\nYear Group: {year_group}\nSubject: {subject}\nAcademic Performance: {academic_performance}\nAreas of Development: {areas_of_development}\n write a  performance report in a continuous, proffesional style, maintaining a {tone} tone throughout. The report should seamlessly integrate the points from the outline into full paragraphs without using bullet points. Follow the \n\nOutline:\n{structure}\n\n"

    # Call the OpenAI API
    chat_completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant, that is great at writing reports given the notes of what to write"},
            {"role": "user", "content": prompt}
        ],
        max_tokens= 1000
    )
    
    # Access the response correctly
    detailed_report = chat_completion.choices[0].message.content.strip()

    return detailed_report


#print(structure)
@app.route('/generate_report', methods=['POST', 'OPTIONS'])
@cross_origin()
def generate_report():
    # if request.method == 'OPTIONS':
    #     # Preflight request, respond with 200 OK and the appropriate CORS headers
    #     response = current_app.make_default_options_response()
    #     return response
    if request.method == 'POST':
        data = request.json
        report = generate_student_report_structure(
            student_name=data.get('student_name'),
            gender=data.get('gender'),
            class_behavior=data.get('class_behavior'),
            strengths=data.get('strengths'),
            year_group=data.get('year_group'),
            subject=data.get('subject'),
            academic_performance=data.get('academic_performance'),
            areas_of_development=data.get('areas_of_development'),
            tone=data.get('tone'),
            report_length=int(data.get('report_length', 100))  # Defaulting to 100 if not provided
        )
        return jsonify({"report": report})
    


    
@app.route('/')
@cross_origin()
def home():
    return "Welcome to the Report Generator API!"


if __name__ == '__main__':
    app.run(debug=False)

    