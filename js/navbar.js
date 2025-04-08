const objectElement = document.getElementById('nav-container');

objectElement.addEventListener('load', () => {
    const objectDocument = objectElement.contentDocument || objectElement.contentWindow.document;
    const objectHeight = objectDocument.body.scrollHeight;

    // Dynamically adjust the height
    objectElement.style.height = `${objectHeight}px`;
});

document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = window.location.pathname;

    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');

            // Create and append an image to the active link
            const activeImage = document.createElement('img');
            activeImage.src = '/images/fungo_icon.png'; // Change to your desired image
            activeImage.alt = 'fungo';
            activeImage.classList.add("nav-fungo");

            // Insert the image before the text
            item.insertBefore(activeImage, item.firstChild);
        } else {
            item.classList.remove('active');

            // Remove any existing active image
            const images = item.getElementsByTagName('img');
            while (images.length > 0) {
                images[0].parentNode.removeChild(images[0]);
            }
        }
    });
});