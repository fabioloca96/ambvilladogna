// Countdown per il prossimo evento
const prossimoEventoData = new Date("Apr 20, 2025 09:00:00").getTime();

function aggiornaCountdown() {
    let oraAttuale = new Date().getTime();
    let distanza = prossimoEventoData - oraAttuale;

    let giorni = Math.floor(distanza / (1000 * 60 * 60 * 24));
    let ore = Math.floor((distanza % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minuti = Math.floor((distanza % (1000 * 60 * 60)) / (1000 * 60));
    let secondi = Math.floor((distanza % (1000 * 60)) / 1000);

    let timerElement = document.getElementById("timer");

    if (distanza > 0) {
        timerElement.innerHTML = `${giorni}g ${ore}h ${minuti}m ${secondi}s`;
    } else {
        timerElement.innerHTML = "L'evento è in corso!";
        clearInterval(interval); // Ferma il timer
    }
}

setInterval(aggiornaCountdown, 1000);

// Popup evento
function apriEvento(evento) {
    const popup = document.getElementById("popup-evento");
    const title = document.getElementById("popup-title");
    const data = document.getElementById("popup-data");
    const descrizione = document.getElementById("popup-descrizione");
    const luogo = document.getElementById("popup-luogo");

    const eventiDettagli = {
        "uscita-bosco": {
            titolo: "Uscita nel Bosco",
            data: "20 Aprile 2025",
            descrizione: "Esplorazione guidata per identificare funghi.",
            luogo: "Bosco della Val Seriana"
        },
        "conferenza": {
            titolo: "Conferenza sulla Micologia",
            data: "5 Maggio 2025",
            descrizione: "Approfondimenti scientifici sui funghi.",
            luogo: "Centro Culturale di Bergamo"
        }
    };

    let info = eventiDettagli[evento];
    title.textContent = info.titolo;
    data.textContent = `📅 ${info.data}`;
    descrizione.textContent = info.descrizione;
    luogo.textContent = `📍 ${info.luogo}`;

    popup.style.display = "flex";
}

function chiudiEvento() {
    document.getElementById("popup-evento").style.display = "none";
}