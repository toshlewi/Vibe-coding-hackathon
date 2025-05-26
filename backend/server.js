require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const twilio = require("twilio");
const Visit = require("./Visit");

const app = express();
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:5500"] }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Check for required env variables
["MONGO_URI", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  });

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Input validation helper
function validateVisitInput(data) {
  const errors = [];
  if (!data.patientName || typeof data.patientName !== 'string') errors.push('Invalid or missing patientName');
  if (!data.diagnosis || typeof data.diagnosis !== 'string') errors.push('Invalid or missing diagnosis');
  if (!data.followUpDate || isNaN(Date.parse(data.followUpDate))) errors.push('Invalid or missing followUpDate');
  if (!data.phone || typeof data.phone !== 'string' || !/^\+\d{10,15}$/.test(data.phone)) errors.push('Invalid or missing phone');
  return errors;
}

// API Endpoints

// Save a new visit
app.post("/api/visits", async (req, res) => {
  const errors = validateVisitInput(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join(", ") });
  try {
    const visit = new Visit({ ...req.body, followUpDate: new Date(req.body.followUpDate) });
    await visit.save();
    res.status(201).json({ message: "Visit saved!" });
  } catch (err) {
    res.status(500).json({ error: "Error saving visit: " + err.message });
  }
});

// Get all follow-ups
app.get("/api/followups", async (req, res) => {
  try {
    const visits = await Visit.find();
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: "Error fetching visits: " + err.message });
  }
});

// Update follow-up date
app.put("/api/followups/:id", async (req, res) => {
  if (!req.body.followUpDate || isNaN(Date.parse(req.body.followUpDate))) {
    return res.status(400).json({ error: "Invalid or missing followUpDate" });
  }
  try {
    const updated = await Visit.findByIdAndUpdate(req.params.id, {
      followUpDate: new Date(req.body.followUpDate)
    }, { new: true });
    if (!updated) return res.status(404).json({ error: "Visit not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "❌ Could not update visit: " + err.message });
  }
});

// Delete a follow-up
app.delete("/api/followups/:id", async (req, res) => {
  try {
    const deleted = await Visit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Visit not found" });
    res.json({ message: "❌ Appointment canceled" });
  } catch (err) {
    res.status(500).json({ error: "❌ Could not cancel appointment: " + err.message });
  }
});

// Cron Job: Run every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("📤 Running daily reminder check...");
  const today = new Date();
  today.setHours(0,0,0,0);
  try {
    const dueVisits = await Visit.find({ followUpDate: { $gte: today, $lt: new Date(today.getTime() + 24*60*60*1000) } });
    for (const visit of dueVisits) {
      const message = `Hello ${visit.patientName}, this is a reminder for your follow-up appointment today for ${visit.diagnosis}.`;
      await client.messages.create({
        body: message,
        from: twilioNumber,
        to: visit.phone
      });
      console.log(`✅ Reminder sent to ${visit.patientName}`);
    }
  } catch (err) {
    console.error("❌ Error sending reminders:", err);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});