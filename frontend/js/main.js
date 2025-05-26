// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    const followUpForm = document.getElementById("followUpForm");

    followUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            patientName: document.getElementById("patientName").value.trim(),
            diagnosis: document.getElementById("diagnosis").value.trim(),
            followUpDate: new Date(document.getElementById("followUpDate").value).toISOString(),
            phone: document.getElementById("phone").value.trim(),
        };

        if (!data.patientName || !data.diagnosis || isNaN(Date.parse(data.followUpDate)) || !/^\+\d{10,15}$/.test(data.phone)) {
            alert("Please fill all fields correctly. Phone must be in international format.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/visits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Unknown error");
            alert("✅ Follow-up created!");
            followUpForm.reset();
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    });
});