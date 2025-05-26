let currentVisitId = null;
let patientPhone = null;

document.addEventListener("DOMContentLoaded", async () => {
  patientPhone = prompt("Enter your phone number (e.g. +2547XXXXXXX):");
  if (!patientPhone || !/^\+\d{10,15}$/.test(patientPhone)) {
    alert("Invalid phone number format.");
    document.getElementById("appointmentInfo").innerHTML = "<p>Invalid phone number.</p>";
    return;
  }
  const nameField = document.getElementById("pName");
  const diagnosisField = document.getElementById("pDiagnosis");
  const dateField = document.getElementById("pDate");
  try {
    const res = await fetch("http://localhost:5000/api/followups");
    const visits = await res.json();
    const myVisits = visits.filter(v => v.phone === patientPhone);
    if (myVisits.length === 0) {
      document.getElementById("appointmentInfo").innerHTML = "<p>No upcoming appointment found for this phone.</p>";
      return;
    }
    // Show the soonest appointment
    myVisits.sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
    const latestVisit = myVisits[0];
    currentVisitId = latestVisit._id;
    nameField.textContent = latestVisit.patientName;
    diagnosisField.textContent = latestVisit.diagnosis;
    dateField.textContent = new Date(latestVisit.followUpDate).toLocaleDateString();
  } catch (error) {
    alert("❌ Error loading patient data: " + error.message);
    document.getElementById("appointmentInfo").innerHTML = "<p>Error loading data.</p>";
  }
});

async function rescheduleFollowUp() {
  if (!currentVisitId) return alert("No appointment to reschedule.");
  const newDate = prompt("Enter new follow-up date (YYYY-MM-DD):");
  if (!newDate || isNaN(Date.parse(newDate))) return alert("Invalid date format.");
  try {
    const res = await fetch(`http://localhost:5000/api/followups/${currentVisitId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followUpDate: new Date(newDate).toISOString() })
    });
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.error || "Unknown error");
    document.getElementById("pDate").textContent = new Date(updated.followUpDate).toLocaleDateString();
    alert("✅ Follow-up rescheduled!");
  } catch (err) {
    alert("❌ Reschedule error: " + err.message);
  }
}

async function cancelFollowUp() {
  if (!currentVisitId) return alert("No appointment to cancel.");
  const confirmCancel = confirm("Are you sure you want to cancel this follow-up?");
  if (!confirmCancel) return;
  try {
    const res = await fetch(`http://localhost:5000/api/followups/${currentVisitId}`, {
      method: "DELETE"
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Unknown error");
    alert("❌ Follow-up canceled!");
    document.getElementById("appointmentInfo").innerHTML = "<p>Follow-up canceled.</p>";
  } catch (err) {
    alert("❌ Cancel error: " + err.message);
  }
}