const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  followUpDate: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

// Backward compatibility: convert string to Date if needed
visitSchema.pre('save', function(next) {
  if (typeof this.followUpDate === 'string') {
    this.followUpDate = new Date(this.followUpDate);
  }
  next();
});

module.exports = mongoose.model("Visit", visitSchema);