// Function to load HTML components
async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error loading component: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Highlight current page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navId = currentPage === 'index.html' ? 'nav-home' : 
                    currentPage === 'about.html' ? 'nav-about' : 
                    currentPage === 'contact.html' ? 'nav-contact' : '';
        
        if (navId) {
            const activeLink = document.getElementById(navId);
            if (activeLink) activeLink.classList.add('active');
        }
    } catch (error) {
        console.error('Failed to load component:', error);
    }
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('components/header.html', 'header-container');
    loadComponent('components/navbar.html', 'navbar-container');
    loadComponent('components/footer.html', 'footer-container');
});
