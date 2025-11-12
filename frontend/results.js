async function loadFlights() {
  const params = new URLSearchParams(window.location.search);
  const origin = params.get("origin") || "JFK";
  const destination = params.get("destination") || "LAX";

  const bestDiv = document.getElementById("best");
  const backupsDiv = document.getElementById("backups");

  bestDiv.textContent = "Fetching flights…";
  backupsDiv.textContent = "";

  try {
    const res = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}`);
    if (!res.ok) throw new Error("Server error " + res.status);
    const data = await res.json();

    const best = data.best;
    if (best) {
      bestDiv.innerHTML = `
        <p><strong>${best.airline?.name || best.airline}</strong> – ${best.flight?.iata || best.flight}</p>
        <p>From ${origin} → ${destination}</p>
        <p>Status: ${best.flight_status || "unknown"}</p>
        <p>Duration: ${best.duration || "n/a"}</p>
        <p>Stops: ${best.stops || "n/a"}</p>
      `;
    } else {
      bestDiv.textContent = "No best option available.";
    }

    backupsDiv.innerHTML = "";
    const backups = data.backups || [];
    if (!backups.length) {
      backupsDiv.textContent = "No backups right now.";
      return;
    }

    backups.forEach(f => {
      const div = document.createElement("div");
      div.className = "flight-card";
      div.innerHTML = `
        <p><strong>${f.airline?.name || f.airline}</strong> – ${f.flight?.iata || f.flight}</p>
        <p>Status: ${f.flight_status || "unknown"}</p>
      `;
      backupsDiv.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    bestDiv.textContent = "Unable to load flights right now.";
  }
}

document.addEventListener("DOMContentLoaded", loadFlights);
