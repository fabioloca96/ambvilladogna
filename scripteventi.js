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

let meseCorrente = new Date().getMonth(); // Mese corrente (0-based)
let annoCorrente = new Date().getFullYear(); // Anno corrente

const eventi = {
  '2025-04-20': {
    titolo: 'Uscita nel Bosco',
    data: '20 Aprile 2025',
    descrizione: 'Escursione guidata per il riconoscimento dei funghi.',
    luogo: 'Bosco di Clusone'
  },
  '2025-05-05': {
    titolo: 'Conferenza sulla Micologia',
    data: '5 Maggio 2025',
    descrizione: 'Incontro serale con esperti micologi.',
    luogo: 'Sala Civica, Rovetta'
  },
  '2025-06-15': {
    titolo: 'Escursione in Montagna',
    data: '15 Giugno 2025',
    descrizione: 'Passeggiata con raccolta e pranzo all’aperto.',
    luogo: 'Monte Farno'
  }
};

function creaCalendario() {
  const calendario = document.getElementById("calendar");
  const meseNome = new Date(annoCorrente, meseCorrente).toLocaleString('it-IT', { month: 'long', year: 'numeric' });
  document.getElementById("meseCorrente").textContent = meseNome;

  const giorniInMese = new Date(annoCorrente, meseCorrente + 1, 0).getDate();
  const primoGiorno = new Date(annoCorrente, meseCorrente, 1);
  const offset = (primoGiorno.getDay() + 6) % 7;

  calendario.innerHTML = ''; // Pulisce il calendario precedente

  const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  giorniSettimana.forEach(g => {
    const el = document.createElement('div');
    el.innerHTML = `<strong>${g}</strong>`;
    calendario.appendChild(el);
  });

  for (let i = 0; i < offset; i++) {
    calendario.appendChild(document.createElement('div'));
  }

  for (let giorno = 1; giorno <= giorniInMese; giorno++) {
    const dataStr = `${annoCorrente}-${String(meseCorrente + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
    const div = document.createElement('div');
    div.className = 'giorno';
    div.textContent = giorno;

    if (eventi[dataStr]) {
      div.classList.add('evento');
      div.onclick = () => mostraDettaglio(dataStr);
    }

    calendario.appendChild(div);
  }
}

function cambiaMese(direz) {
  meseCorrente += direz;
  if (meseCorrente > 11) {
    meseCorrente = 0;
    annoCorrente++;
  } else if (meseCorrente < 0) {
    meseCorrente = 11;
    annoCorrente--;
  }
  creaCalendario(); // Rende di nuovo il calendario per il mese selezionato
}

function mostraDettaglio(data) {
  const evento = eventi[data];
  if (evento) {
    document.getElementById("titoloEvento").textContent = evento.titolo;
    document.getElementById("dataEvento").textContent = `📅 ${evento.data}`;
    document.getElementById("descrizioneEvento").textContent = evento.descrizione;
    document.getElementById("luogoEvento").textContent = `📍 ${evento.luogo}`;
    document.getElementById("eventoDettaglio").classList.remove("hidden");
  }
}

function chiudiDettaglio() {
  document.getElementById("eventoDettaglio").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", creaCalendario);
