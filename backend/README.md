# Backend README for MediSync Follow-Up Reminder System

## Overview
The MediSync Follow-Up Reminder System is a healthtech application designed to help clinics and private doctors manage patient follow-ups efficiently. This backend service handles the creation, retrieval, updating, and deletion of patient visit records, and sends automated reminders via SMS or WhatsApp.

## Features
- RESTful API for managing patient visits and follow-ups
- MongoDB integration for data persistence
- Automated SMS/WhatsApp reminders using Twilio
- Cron job for daily reminder checks
- Input validation for all endpoints

## Tech Stack
- **Node.js**: JavaScript runtime for building the backend
- **Express.js**: Web framework for building the API
- **MongoDB**: NoSQL database for storing patient visit records
- **Twilio**: API for sending SMS and WhatsApp messages
- **node-cron**: Scheduler for running tasks at specified intervals

## Installation & Setup

1. Clone the repository:
   git clone https://github.com/yourusername/medisync-followup-reminder.git
   cd medisync-followup-reminder/backend

2. Install dependencies:
   npm install

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```
   MONGO_URI=your_mongodb_connection_string
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. Start the server:
   npm start

## API Endpoints

### Create a New Visit
- **POST** `/api/visits`
- Request Body: 
  ```json
  {
    "patientName": "John Doe",
    "diagnosis": "Flu",
    "followUpDate": "2025-06-01T00:00:00.000Z",
    "phone": "+254712345678"
  }
  ```

### Get All Follow-Ups
- **GET** `/api/followups`

### Update a Follow-Up
- **PUT** `/api/followups/:id`
- Request Body: 
  ```json
  {
    "followUpDate": "2025-06-15T00:00:00.000Z"
  }
  ```

### Delete a Follow-Up
- **DELETE** `/api/followups/:id`

## Reminder System
The backend includes a cron job that runs daily at 9 AM to check for upcoming follow-ups and sends reminders to patients via SMS or WhatsApp.

## Notes
- All endpoints validate input and return detailed error messages.
- The `followUpDate` field is now a Date type in MongoDB.
- See `.env.example` for required environment variables.

## Future Enhancements
- Implement user authentication for doctors and clinic staff
- Create an admin dashboard for managing visits
- Integrate AI for smart follow-up suggestions

## Contact
For any questions or contributions, please reach out to:
- Your Name — [your.email@example.com](mailto:your.email@example.com)  
- GitHub: [yourusername](https://github.com/yourusername)"# Vibe-coding-hackathon" 
