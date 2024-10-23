## BASIC QUIZ FOM+RM

{
"formName": "Basic Math Quiz",
"formDescription": "A quiz to test basic math skills.",
"formType": "Quiz",
"startingDate": "2023-10-01T00:00:00Z",
"endingDate": "2023-12-31T00:00:00Z",
"encryption": false,
"encryptionType": null,
"questions": [
{
"questionText": "What is 2 + 2?",
"questionType": "MULTIPLE_CHOICE",
"options": ["3", "4", "5"],
"correctAnswer": 1,
"explanation": "2 + 2 equals 4.",
"timeLimit": 30
}
]
}

###

{
"formName": "Science Knowledge Quiz",
"formDescription": "Test your science knowledge.",
"formType": "Quiz",
"startingDate": "2023-11-01T00:00:00Z",
"endingDate": "2024-01-01T00:00:00Z",
"encryption": true,
"encryptionType": "AES",
"questions": [
{
"questionText": "What is the chemical symbol for water?",
"questionType": "PICK_ONE",
"options": ["H2O", "O2", "CO2"],
"correctAnswer": 0,
"explanation": "The chemical symbol for water is H2O.",
"timeLimit": 15,
"formId":"671819c12ce85c28b53337d7"
}
]
}

###

{
"formName": "World History Quiz",
"formDescription": "A quiz to test your knowledge of world history.",
"formType": "Quiz",
"startingDate": "2023-12-01T00:00:00Z",
"endingDate": "2024-02-01T00:00:00Z",
"encryption": false,
"encryptionType": null,
"questions": [
{
"questionText": "Who was the first president of the USA?",
"questionType": "MULTIPLE_CHOICE",
"options": ["Abraham Lincoln", "George Washington", "Thomas Jefferson"],
"correctAnswer": 1,
"explanation": "George Washington was the first president of the USA.",
"timeLimit": 40,
"formId":"671819c12ce85c28b53337d7"
}
]
}

###

{
"formName": "Geography Challenge",
"formDescription": "Challenge your geography knowledge.",
"formType": "Quiz",
"startingDate": "2023-10-15T00:00:00Z",
"endingDate": "2024-01-15T00:00:00Z",
"encryption": true,
"encryptionType": "RSA",
"questions": [
{
"questionText": "What is the capital of Japan?",
"questionType": "SINGLE_CHOICE",
"options": ["Beijing", "Seoul", "Tokyo"],
"correctAnswer": 2,
"explanation": "Tokyo is the capital of Japan.",
"timeLimit": 25
}
]
}

1. Multiple Choice Question
   json
   Copy code
   {
   "formName": "General Knowledge Quiz",
   "formDescription": "A quiz to test general knowledge.",
   "formType": "Quiz",
   "startingDate": "2024-01-01T00:00:00Z",
   "endingDate": "2024-12-31T23:59:59Z",
   "encryption": true,
   "encryptionType": "AES",
   "questions": [
   {
   "questionText": "What is the capital of France?",
   "questionType": "Multiple Choice",
   "options": ["Paris", "London", "Berlin", "Madrid"],
   "correctAnswer": 0,
   "explanation": "Paris is the capital of France.",
   "timeLimit": 30
   }
   ]
   }
2. True/False Question
   json
   Copy code
   {
   "formName": "Science Facts Quiz",
   "formDescription": "A quiz on basic science facts.",
   "formType": "Quiz",
   "startingDate": "2024-02-01T00:00:00Z",
   "endingDate": "2024-11-30T23:59:59Z",
   "encryption": false,
   "encryptionType": "None",
   "questions": [
   {
   "questionText": "The Earth is flat.",
   "questionType": "True/False",
   "options": ["True", "False"],
   "correctAnswer": 1,
   "explanation": "The Earth is round.",
   "timeLimit": 15
   }
   ]
   }
3. Short Answer Question
   json
   Copy code
   {
   "formName": "Basic Programming Quiz",
   "formDescription": "A quiz on basic programming knowledge.",
   "formType": "Quiz",
   "startingDate": "2024-03-01T00:00:00Z",
   "endingDate": "2024-10-31T23:59:59Z",
   "encryption": true,
   "encryptionType": "RSA",
   "questions": [
   {
   "questionText": "What does HTML stand for?",
   "questionType": "Short Answer",
   "timeLimit": 20
   }
   ]
   }
4. Paragraph Question
   json

{
"formName": "Creative Writing Assessment",
"formDescription": "An assessment for creative writing.",
"formType": "Assessment",
"startingDate": "2024-04-01T00:00:00Z",
"endingDate": "2024-09-30T23:59:59Z",
"encryption": true,
"encryptionType": "AES",
"questions": [
{
"questionText": "Describe your most memorable experience in life.",
"questionType": "Paragraph",
"timeLimit": 300
}
]
}

# RESPONSE

{
"responseType": "MULTIPLE_CHOICE",
"formId": "6525f9a69c0b7f001e2a4b3a",
"submissionDate": "2024-10-20T12:34:56.000Z",
"answers": [
{
"questionId": "6525f9b69c0b7f001e2a4b3b",
"questionType": "MULTIPLE_CHOICE"
}
]
}

{
"email": "user1@example.com",
"responseType": "TEXT",
"formId": "6525f9a69c0b7f001e2a4b3a",
"submissionDate": "2024-10-20T12:34:56.000Z",
"answers": [
{
"questionId": "6525f9b69c0b7f001e2a4b3b",
"questionType": "TEXT",
"answer": "This is my answer",
"pickOne": 1
}
]
}

{
"name": "John Doe",
"responseType": "MULTIPLE_CHOICE",
"formId": "6525f9a69c0b7f001e2a4b3a",
"submissionDate": "2024-10-20T12:34:56.000Z",
"answers": [
{
"questionId": "6525f9b69c0b7f001e2a4b3b",
"questionType": "MULTIPLE_CHOICE",
"multipleChoiceAnswer": [1, 2],
"booleanQuestion": true
}
]
}

{
"email": "user2@example.com",
"name": "Jane Doe",
"encryptionKey": "abc123",
"responseType": "BOOLEAN",
"submissionDate": "2024-10-20T12:34:56.000Z",
"formId": "6525f9a69c0b7f001e2a4b3a",
"answers": [
{
"questionId": "6525f9b69c0b7f001e2a4b3b",
"questionType": "BOOLEAN",
"answer": "Yes",
"multipleChoiceAnswer": [3],
"booleanQuestion": false,
"pickOne": 2
}
]
}
