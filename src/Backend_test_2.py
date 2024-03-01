import os
from openai import OpenAI
from flask import Flask, render_template, request, jsonify, current_app
from flask_cors import CORS, cross_origin

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
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens= 500
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

    

    prompt = f" Given the structure of the report provided, and the following details:\n\nStudent Name: {student_name}\nGender: {gender}\nClass Behavior: {class_behavior}\nStrengths: {strengths}\nYear Group: {year_group}\nSubject: {subject}\nAcademic Performance: {academic_performance}\nAreas of Development: {areas_of_development}\n write a  performance report in a continuous, proffesional style, maintaining a {tone} tone throughout. The report should seamlessly integrate the points from the outline into full paragraphs without using bullet points. The total report length must strictly be  {report_length} words. Follow the \n\nOutline:\n{structure}\n\n"

    # Call the OpenAI API
    chat_completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant, that is great at writing reports given the structure of the report."},
            {"role": "user", "content": prompt}
        ],
        max_tokens= 500
    )
    
    # Access the response correctly
    detailed_report = chat_completion.choices[0].message.content.strip()

    return detailed_report


#print(structure)
#change name 
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
            report_length=int(data.get('report_length', 150))  # Defaulting to 100 if not provided
        )
        return jsonify({"report": report})
    

@app.route('/generate_detailed_report', methods=['POST'])
@cross_origin()  # Make sure to allow CORS for this endpoint
def generate_detailed_report_endpoint():
    # Ensure you're getting JSON data
    if request.is_json:
        data = request.get_json()
        structure = data.get('structure')
        student_name = data.get('student_name')
        gender = data.get('gender')
        class_behavior = data.get('class_behavior')
        strengths = data.get('strengths')
        year_group = data.get('year_group')
        subject = data.get('subject')
        academic_performance = data.get('academic_performance')
        areas_of_development = data.get('areas_of_development')
        tone = data.get('tone')
        report_length = data.get('report_length', 200)  # Default to 1000 if not provided
        
        # Call the function to generate the detailed report
        detailed_report = generate_detailed_report_from_structure(structure, student_name, gender, class_behavior, strengths, year_group, subject, academic_performance, areas_of_development, tone, report_length)

        # Return the detailed report
        return jsonify({"detailedReport": detailed_report})
    else:
        return jsonify({"error": "Request must be JSON"}), 400
    

@app.route('/regenerate_detailed_report', methods=['POST'])
@cross_origin()
def regenerate_detailed_report():
    if request.is_json:
        # Extract the necessary data from the request
        data = request.get_json()
        last_saved_structure = data.get('last_saved_structure')
        last_saved_report = data.get('last_saved_report')
        current_structure = data.get('current_structure')
        current_report = data.get('current_report')
        tone = data.get('tone')
        report_length = data.get('report_length', 200)

        # Reuse the OpenAI client setup
        client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

        # Create the prompt for the OpenAI API call
        prompt = (
            f"Here is the previous report outline and the corresponding detailed report:\n\n"
            f"Previous Outline :\n{last_saved_structure}\n\nPrevious Full Report:\n{last_saved_report}\n\n"
            f"The outline has been updated to the following, and some changes have been made to the detailed report as well:\n\n"
            f"Updated Outline:\n{current_structure}\n\nUpdated Full Report (in progress):\n{current_report}\n\n"
            #f"Please rewrite the detailed report to reflect the changes in the updated outline while maintaining the detailed changes made by the user in the updated report. "
            f"Please putput the (exact) text present in the current detailed report and only make incorporate the small changes present in the updated outline "

            f"Ensure the new report uses exactly the same text present in the current report and structly only  changes the text where needed to integrate the updates from the new structure. The total length of the report must be around  \n{report_length}\n\n words"
        )

        # Call the OpenAI API
        chat_completion = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant, skilled at revising and updating reports based on the report structure provided while maintaining user edits"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=  2 * report_length, # Adjust the number of tokens based on the expected length of the report
            #temperature = 0.1,  # Set to a lower value to make output more deterministic
            frequency_penalty = 0.5 ,  # Set to encourage less repetition
            presence_penalty = - 0.4,  # Set to discourage deviation from input content
            temperature = 0.1
        )

        # Access the response correctly
        new_detailed_report = chat_completion.choices[0].message.content.strip()

        # Return the updated detailed report
        return jsonify({"updatedDetailedReport": new_detailed_report})
    else:
        return jsonify({"error": "Request must be JSON"}), 400
    
@app.route('/')
@cross_origin()
def home():
    return "Welcome to the Report Generator API!"


if __name__ == '__main__':
    app.run(debug=False)

    