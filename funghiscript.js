// Filtra i funghi in base al tipo
function filtraFunghi(tipo) {
    let funghi = document.querySelectorAll('.fungo');

    funghi.forEach(fungo => {
        if (tipo === "tutti" || fungo.dataset.tipo === tipo) {
            fungo.style.display = "block";
        } else {
            fungo.style.display = "none";
        }
    });
}

// Popup con dettagli sul fungo
function apriPopup(fungo) {
    const popup = document.getElementById("popup-fungo");
    const img = document.getElementById("popup-img");
    const title = document.getElementById("popup-title");
    const scientifico = document.getElementById("popup-scientifico");
    const descrizione = document.getElementById("popup-descrizione");
    const habitat = document.getElementById("popup-habitat");

    const dettagliFunghi = {
        "porcino": {
            img: "img/porcino.jpg",
            nome: "Porcino",
            scientifico: "Boletus edulis",
            descrizione: "Fungo commestibile molto pregiato, dal sapore intenso e carnoso.",
            habitat: "Boschi di latifoglie e conifere, preferisce terreni umidi."
        },
        "amanita": {
            img: "img/amanita.jpg",
            nome: "Amanita Muscaria",
            scientifico: "Amanita muscaria",
            descrizione: "Fungo tossico con cappello rosso e puntini bianchi.",
            habitat: "Boschi di latifoglie e conifere, su suoli acidi."
        },
        "ovolo": {
            img: "img/ovolo.jpg",
            nome: "Ovolo Buono",
            scientifico: "Amanita caesarea",
            descrizione: "Fungo raro e commestibile, apprezzato per il suo sapore delicato.",
            habitat: "Boschi di querce e castagni."
        }
    };

    let info = dettagliFunghi[fungo];
    img.src = info.img;
    title.textContent = info.nome;
    scientifico.textContent = `Nome scientifico: ${info.scientifico}`;
    descrizione.textContent = info.descrizione;
    habitat.textContent = `Habitat: ${info.habitat}`;
    
    popup.style.display = "flex";
}

function chiudiPopup() {
    document.getElementById("popup-fungo").style.display = "none";
}