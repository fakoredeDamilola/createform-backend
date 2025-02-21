# createform-backend

## Description
createform is the  backend service that allows users to create custom forms with various types of questions, including:
- Short text
- Long text
- Fill in the gap
- Number
- Multiple choice question
- Boolean question

The project is built using **NestJS** and **MongoDB**, providing a scalable and efficient solution for form creation and management.

## Features
- User authentication and authorization
- Create, update, and delete forms
- Support for multiple question types
- Store and retrieve form responses
- Secure and efficient API using NestJS and MongoDB

## Planned Improvements
Future updates will include:
- More question types (e.g., multiple-choice, dropdown, rating scales)
- Support for images, audio, and video uploads
- PDF submission support
- Enhanced user interface for form creation and response analysis

## Technologies Used
- **Backend:** NestJS, TypeScript, MongoDB
- **Authentication:** JWT
- **Storage:** MongoDB Atlas
- **Deployment:** Docker (optional), Vercel/Netlify (Frontend integration)

## Installation
### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or cloud)

### Setup
1. Clone the repository:
   ```sh
   git clone [createform-backend](https://github.com/fakoredeDamilola/createform-backend)
   cd createform-backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Start the server:
   ```sh
   npm run start:dev
   ```

## API Endpoints
| Method | Endpoint          | Description                     |
|--------|------------------|---------------------------------|
| GET    | /form/get        | Get all forms                   |
| POST   | /form/new        | Create a new form               |
| GET    | /form/:slug      | Get form by slug                |
| PUT    | /forms/:id       | Update an existing form         |
| DELETE | /forms/:id       | Delete a form                   |
| POST   | /forms/:id/submit | Submit a form response         |

## Contribution
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For questions or contributions, feel free to reach out:
- Email: dammy.fakorede@gmail.com
- LinkedIn: [Your Profile]([https://www.linkedin.com/in/fakorededamilola/](https://www.linkedin.com/in/fakorededamilola/))
- GitHub: [https://github.com/fakoredeDamilola](https://github.com/fakoredeDamilola)

