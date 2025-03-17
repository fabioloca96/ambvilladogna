document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript caricato!");

    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(element => observer.observe(element));
});

/* ✨ UNICO EVENT LISTENER per il parallax e il distanziamento dinamico */
document.addEventListener("scroll", function () {
    let scrollTop = window.scrollY;

    document.querySelectorAll(".hero").forEach((hero) => {
        let title = hero.querySelector(".hero__title");
        let subtitle = hero.querySelector(".hero__subtitle");
        let button = hero.querySelector(".cta-btn");

        if (title && subtitle && button) {
            let movement = Math.min(Math.max((scrollTop - hero.offsetTop) * 0.2, -50), 50); // 🔥 Limitiamo il movimento
            let spacing = Math.min(Math.max(50 + movement * 0.3, 50), 120); // 🔥 Manteniamo distanze controllate
            let buttonSpacing = Math.min(Math.max(40 + movement * 0.3, 40), 100); 

            title.style.transform = `translateY(${movement * 0.3}px)`;
            subtitle.style.transform = `translateY(${movement * 0.4}px)`;
            subtitle.style.marginTop = `${spacing}px`;
            button.style.transform = `translateY(${movement * 0.4}px)`;
            button.style.marginTop = `${buttonSpacing}px`;
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    let container = document.querySelector(".eventi-container");

    if (container) {
        setInterval(() => {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
                container.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                container.scrollBy({ left: 340, behavior: "smooth" });
            }
        }, 3500); // Cambio evento ogni 3.5 secondi
    }
});
document.addEventListener("DOMContentLoaded", function () {
    let container = document.querySelector(".eventi-container");

    fetch("events.json")
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ""; // Pulisce il contenitore

            data.forEach(evento => {
                let eventoHTML = `
                    <div class="evento">
                        <img src="${evento.immagine}" alt="${evento.titolo}">
                        <h3>${evento.titolo}</h3>
                        <p class="data"><strong>${evento.data}</strong></p>
                        <p class="descrizione">${evento.descrizione}</p>
                        <a href="${evento.link}" class="btn">Scopri di più</a>
                    </div>
                `;
                container.innerHTML += eventoHTML;
            });
        })
        .catch(error => console.error("Errore nel caricamento degli eventi:", error));
});
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.createElement("button");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = "☰"; // Icona hamburger

    document.body.appendChild(menuToggle);

    menuToggle.addEventListener("click", function () {
        document.querySelector(".navbar").classList.toggle("active");
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.createElement("button");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = "☰";

    document.body.appendChild(menuToggle);

    const navbar = document.querySelector(".navbar");

    menuToggle.addEventListener("click", function () {
        navbar.classList.toggle("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
});
