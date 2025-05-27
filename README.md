# MediSync Follow-Up Reminder System

## Overview
A human-centered healthtech app that helps clinics and doctors track patient follow-ups and send automated SMS/WhatsApp reminders to patients, reducing missed appointments and improving care adherence.

## Features
- Create follow-up appointments with patient details (name, diagnosis, phone, date)
- Automatic daily reminders sent via Twilio SMS or WhatsApp
- Patients can reschedule or cancel follow-ups easily
- Backend built with Node.js, Express, MongoDB, and node-cron
- Simple, responsive frontend with Bootstrap
- Input validation for all endpoints
- Patient dashboard filters appointments by phone number

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB (NoSQL)
- SMS/WhatsApp API: Twilio
- Scheduler: node-cron

## Installation & Setup

### Backend
```bash
git clone https://github.com/toshlewi/Vibe-coding-hackathon.git
cd Vibe-coding-hackathon/backend
npm install
Environment Variables
Copy .env.example to .env and set:

env
Copy code
MONGO_URI=your_mongodb_connection_string
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
Start the Server
bash
Copy code
npm start
Frontend
Open frontend/index.html in your browser.

API Endpoints
Create a New Visit
POST /api/visits

json
Copy code
{
  "patientName": "John Doe",
  "diagnosis": "Flu",
  "followUpDate": "2025-06-01T00:00:00.000Z",
  "phone": "+254712345678"
}
Get All Follow-Ups
GET /api/followups

Update a Follow-Up
PUT /api/followups/:id

Delete a Follow-Up
DELETE /api/followups/:id

Reminder System
A cron job runs daily at 9 AM to send SMS/WhatsApp reminders to patients with upcoming appointments.

Future Enhancements
Add user authentication

AI-suggested follow-up intervals

Multi-language support

Appointment analytics dashboard



Contact
Lewis Gitonga
📧 Email: adelewigitz@gmail.com
📞 Phone: 0711527211
🔗 GitHub: Vibe-coding-hackathon

yaml
Copy code

---

### ✅ Next Steps

1. Replace your current `README.md` file with this one.
2. Then run these in your terminal:

```bash
git add README.md
git commit -m "Fix merge conflict in README.md and update contact info"
git push origin main
