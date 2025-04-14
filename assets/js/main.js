/**
 * Main JavaScript file for the website
 * Contains common functionality used across multiple pages
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common UI elements and interactions
    initializeCommonElements();
    
    // Set up any event listeners needed across the site
    setupGlobalEventListeners();
});

/**
 * Initialize common UI elements and functionality
 */
function initializeCommonElements() {
    // Example: Add scroll-to-top button functionality if it exists
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show button when user scrolls down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
    }
    
    // Add any responsive navigation functionality
    initializeResponsiveNav();
}

/**
 * Set up mobile/responsive navigation
 */
function initializeResponsiveNav() {
    // Add mobile menu toggle functionality if it exists
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navContainer = document.getElementById('navbar-container');
    
    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', function() {
            navContainer.querySelector('nav').classList.toggle('mobile-open');
            menuToggle.setAttribute(
                'aria-expanded', 
                menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
}

/**
 * Set up global event listeners for site-wide functionality
 */
function setupGlobalEventListeners() {
    // Example: Add form validation listeners to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', validateForm);
    });
    
    // Example: Add external link handling
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        // Add rel="noopener noreferrer" for security
        if (!link.getAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
            const rel = link.getAttribute('rel') ? link.getAttribute('rel') + ' noopener noreferrer' : 'noopener noreferrer';
            link.setAttribute('rel', rel);
        }
    });
}

/**
 * Basic form validation
 * @param {Event} event - The form submission event
 */
function validateForm(event) {
    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    
    // Reset previous error messages
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Check each required field
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required';
            field.parentNode.appendChild(errorMessage);
            
            // Highlight the field
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Check email fields
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            valid = false;
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Please enter a valid email address';
            field.parentNode.appendChild(errorMessage);
            
            // Highlight the field
            field.classList.add('error');
        }
    });
    
    if (!valid) {
        event.preventDefault();
    }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Utility function to format dates consistently
 * @param {Date} date - Date object to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
