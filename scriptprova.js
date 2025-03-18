
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

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
});
