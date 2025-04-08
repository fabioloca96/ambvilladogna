let funghiData = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch("/data/schedefunghi.json")
    .then(response => response.json())
    .then(data => {
      funghiData = data;
      popolaSelectGeneri(data);
      mostraFunghi(data);
    })
    .catch(error => console.error("Errore nel caricamento dei funghi:", error));
});

function popolaSelectGeneri(data) {
  const generiUnici = [...new Set(data.map(f => f.genere))];
  const genereSelect = document.getElementById("genereFiltro");
  generiUnici.sort().forEach(genere => {
    const option = document.createElement("option");
    option.value = genere;
    option.textContent = genere;
    genereSelect.appendChild(option);
  });
}

function applicaFiltri() {
  const genereFiltro = document.getElementById("genereFiltro").value;
  const commestibilitaFiltro = document.getElementById("commestibilitaFiltro").value;
  const raritaFiltro = document.getElementById("raritaFiltro").value;

  const filtrati = funghiData.filter(fungo => {
    return (!genereFiltro || fungo.genere === genereFiltro) &&
           (!commestibilitaFiltro || fungo.commestibilita === commestibilitaFiltro) &&
           (!raritaFiltro || fungo.rarita === raritaFiltro);
  });

  mostraFunghi(filtrati);
}

function mostraFunghi(funghi) {
  const container = document.getElementById("listaFunghi");
  container.innerHTML = "";

  if (funghi.length === 0) {
    container.innerHTML = "<p>Nessun fungo trovato con i filtri selezionati.</p>";
    return;
  }

  funghi.forEach(fungo => {
    const card = `
      <div class="fungo-card fade-in">
        <img src="${fungo.immagine}" alt="${fungo.nome_comune}">
        <h3>${fungo.genere} ${fungo.specie}</h3>
        <p><strong>Nome comune:</strong> ${fungo.nome_comune}</p>
        <p><strong>Habitat:</strong> ${fungo.habitat}</p>
        <p><strong>Ecologia:</strong> ${fungo.ecologia}</p>
        <p><strong>Commestibilità:</strong> ${fungo.commestibilita}</p>
        <p><strong>Rarità:</strong> ${fungo.rarita}</p>
      </div>
    `;
    container.innerHTML += card;
  });
}
