document.addEventListener("DOMContentLoaded", () => {
  const visitForm = document.getElementById("visitForm");
  const followUpList = document.getElementById("followUpList");
  const followUps = [];

  visitForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("patientName").value.trim();
    const date = document.getElementById("visitDate").value;
    const diagnosis = document.getElementById("diagnosis").value.trim();
    const phone = document.getElementById("phone").value.trim();
    if (!name || !date || !diagnosis || !/^\+\d{10,15}$/.test(phone)) {
      alert("Please fill all fields correctly. Phone must be in international format.");
      return;
    }
    const followUpDate = suggestFollowUpDate(diagnosis, date);
    const followUp = {
      patientName: name,
      diagnosis: diagnosis,
      followUpDate: new Date(followUpDate).toISOString(),
      phone: phone
    };
    followUps.push(followUp);
    await saveVisitToDB(followUp);
    displayFollowUps();
    visitForm.reset();
  });

  function suggestFollowUpDate(diagnosis, visitDate) {
    const visit = new Date(visitDate);
    let days = 7;
    const lowerDiagnosis = diagnosis.toLowerCase();
    if (lowerDiagnosis.includes("malaria")) days = 14;
    else if (lowerDiagnosis.includes("uti")) days = 10;
    else if (lowerDiagnosis.includes("hypertension")) days = 30;
    const followUp = new Date(visit.getTime() + days * 24 * 60 * 60 * 1000);
    return followUp.toISOString().split("T")[0];
  }

  async function saveVisitToDB(visitData) {
    try {
      const res = await fetch("http://localhost:5000/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");
      alert("✅ Saved: " + (result.message || "Follow-up created!"));
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  }

  function displayFollowUps() {
    followUpList.innerHTML = "";
    followUps.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.patientName}</strong> – ${item.diagnosis}  <br>Follow-up: <em>${item.followUpDate}</em>
        <br><button onclick="markDone(${index})">Mark as Done</button>
      `;
      followUpList.appendChild(li);
    });
  }

  window.markDone = function(index) {
    followUps.splice(index, 1);
    displayFollowUps();
  };

  async function loadFollowUps() {
    try {
      const res = await fetch("http://localhost:5000/api/followups");
      const data = await res.json();
      followUps.length = 0;
      followUps.push(...data);
      displayFollowUps();
    } catch (err) {
      alert("❌ Error loading follow-ups: " + err.message);
    }
  }

  loadFollowUps();
});