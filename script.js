document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript caricato!");

    // Fade-in quando entrano in viewport
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

    // Caricamento eventi dinamici
    let container = document.querySelector(".eventi-container");
    if (container) {
        fetch("events.json")
            .then(response => response.json())
            .then(data => {
                container.innerHTML = ""; 
                data.forEach(evento => {
                    let eventoHTML = `
                        <div class="evento fade-in">
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
    }

    // Gestione hamburger menu solo su mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            }
        });

        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape") {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    }
});

// Effetto parallax + distanziamento dinamico dei testi e bottoni
document.addEventListener("scroll", function () {
    let scrollTop = window.scrollY;

    document.querySelectorAll(".hero").forEach((hero) => {
        let content = hero.querySelector('.hero__content');
        if (content) {
            let title = content.querySelector(".hero__title");
            let subtitle = content.querySelector(".hero__subtitle");
            let button = content.querySelector(".cta-btn");

            if (title && subtitle && button) {
                let movement = Math.min(Math.max((scrollTop - hero.offsetTop) * 0.2, -50), 50);
                let spacing = Math.min(Math.max(50 + movement * 0.3, 50), 120);
                let buttonSpacing = Math.min(Math.max(40 + movement * 0.3, 40), 100);

                title.style.transform = `translateY(${movement * 0.3}px)`;
                subtitle.style.transform = `translateY(${movement * 0.4}px)`;
                subtitle.style.marginTop = `${spacing}px`;
                button.style.transform = `translateY(${movement * 0.4}px)`;
                button.style.marginTop = `${buttonSpacing}px`;
            }
        }
    });
});
