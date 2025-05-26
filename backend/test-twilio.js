const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages.create({
  body: 'Hello from MediSync!',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: '+19786904562' // Replace with your verified/test number
}).then(message => console.log(message.sid))
  .catch(err => console.error(err));