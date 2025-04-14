// Global variables
let events = [];
let currentDate = new Date();

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // First load components
    loadComponents().then(() => {
        // Then load calendar data
        fetchCalendarData();
        
        // Set up event listeners
        document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));
        document.getElementById('close-details').addEventListener('click', hideEventDetails);
    });
});

// Load components using the components.js functionality
async function loadComponents() {
    try {
        await Promise.all([
            loadComponent('components/header.html', 'header-container'),
            loadComponent('components/navbar.html', 'navbar-container'),
            loadComponent('components/footer.html', 'footer-container')
        ]);
        
        // Highlight current page in navigation
        const navLink = document.getElementById('nav-events');
        if (navLink) navLink.classList.add('active');
        
        return true;
    } catch (error) {
        console.error('Failed to load components:', error);
        return false;
    }
}

// Fetch and parse the iCalendar file
async function fetchCalendarData() {
    try {
        const response = await fetch('calendar/cal.ics');
        if (!response.ok) {
            throw new Error(`Error loading calendar: ${response.statusText}`);
        }
        
        const icsData = await response.text();
        parseICalendarData(icsData);
        
        // After parsing, render the calendar and events list
        renderCalendar(currentDate);
        renderEventsList();
    } catch (error) {
        console.error('Failed to load calendar data:', error);
        document.querySelector('.loading-message').textContent = 'Could not load calendar data. Please try again later.';
    }
}

// Parse iCalendar data
function parseICalendarData(icsData) {
    events = [];
    
    // Basic parsing - this is simplified and doesn't handle all iCalendar features
    const lines = icsData.split('\n');
    let currentEvent = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === 'BEGIN:VEVENT') {
            currentEvent = {
                id: Date.now() + Math.random().toString(36).substring(2, 9),
                title: '',
                start: null,
                end: null,
                location: '',
                description: ''
            };
        } else if (line === 'END:VEVENT' && currentEvent) {
            events.push(currentEvent);
            currentEvent = null;
        } else if (currentEvent) {
            // Parse event properties
            if (line.startsWith('SUMMARY:')) {
                currentEvent.title = line.substring(8);
            } else if (line.startsWith('DTSTART:')) {
                currentEvent.start = parseICalDate(line.substring(8));
            } else if (line.startsWith('DTEND:')) {
                currentEvent.end = parseICalDate(line.substring(6));
            } else if (line.startsWith('LOCATION:')) {
                currentEvent.location = line.substring(9);
            } else if (line.startsWith('DESCRIPTION:')) {
                currentEvent.description = line.substring(12);
            }
        }
    }
    
    // Sort events by start date
    events.sort((a, b) => a.start - b.start);
}

// Parse iCalendar date format (e.g., 20230915T100000Z)
function parseICalDate(dateStr) {
    // Basic parser - doesn't handle all iCal date formats
    if (!dateStr) return null;
    
    // Remove any timezone indicator
    dateStr = dateStr.replace('Z', '');
    
    // Extract date components
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JavaScript months are 0-based
    const day = parseInt(dateStr.substring(6, 8));
    
    // Check if time is included
    if (dateStr.includes('T')) {
        const hour = parseInt(dateStr.substring(9, 11));
        const minute = parseInt(dateStr.substring(11, 13));
        const second = parseInt(dateStr.substring(13, 15) || '0');
        
        return new Date(year, month, day, hour, minute, second);
    } else {
        return new Date(year, month, day);
    }
}

// Render the calendar for a specific month
function renderCalendar(date) {
    const calendarView = document.getElementById('calendar-view');
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    
    // Update month display
    document.getElementById('current-month').textContent = `${getMonthName(currentMonth)} ${currentYear}`;
    
    // Clear previous calendar
    calendarView.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        calendarView.appendChild(dayHeader);
    });
    
    // Get first day of the month and last day
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Fill in days from previous month
    let dayOfWeek = firstDay.getDay();
    if (dayOfWeek > 0) {
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = dayOfWeek - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.innerHTML = `<div class="day-number">${prevMonthLastDay - i}</div>`;
            calendarView.appendChild(day);
        }
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        
        // Highlight today
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            i === today.getDate()) {
            day.classList.add('today');
        }
        
        day.innerHTML = `<div class="day-number">${i}</div>`;
        
        // Add events for this day
        const dayDate = new Date(currentYear, currentMonth, i);
        const dayEvents = getEventsForDay(dayDate);
        
        dayEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'event-indicator';
            eventEl.textContent = event.title;
            eventEl.dataset.eventId = event.id;
            eventEl.addEventListener('click', () => showEventDetails(event.id));
            day.appendChild(eventEl);
        });
        
        calendarView.appendChild(day);
    }
    
    // Fill in days from next month
    const totalCells = Math.ceil((dayOfWeek + lastDay.getDate()) / 7) * 7;
    const nextMonthDays = totalCells - (dayOfWeek + lastDay.getDate());
    for (let i = 1; i <= nextMonthDays; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.innerHTML = `<div class="day-number">${i}</div>`;
        calendarView.appendChild(day);
    }
}

// Render the list of upcoming events
function renderEventsList() {
    const eventsListEl = document.getElementById('events-list');
    eventsListEl.innerHTML = '';
    
    // Filter for future events only
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureEvents = events.filter(event => event.start >= today);
    
    if (futureEvents.length === 0) {
        eventsListEl.innerHTML = '<p>No upcoming events scheduled.</p>';
        return;
    }
    
    // Display first 10 upcoming events
    const eventsToShow = futureEvents.slice(0, 10);
    
    eventsToShow.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item';
        eventEl.dataset.eventId = event.id;
        
        eventEl.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-date">${formatDateLong(event.start)}</div>
            ${event.location ? `<div class="event-location">${event.location}</div>` : ''}
        `;
        
        eventEl.addEventListener('click', () => showEventDetails(event.id));
        eventsListEl.appendChild(eventEl);
    });
}

// Show details for a specific event
function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const detailsEl = document.getElementById('event-details');
    const contentEl = detailsEl.querySelector('.event-details-content');
    
    contentEl.innerHTML = `
        <h4>${event.title}</h4>
        <p><strong>Date:</strong> ${formatDateLong(event.start)}</p>
        <p><strong>Time:</strong> ${formatTime(event.start)} - ${formatTime(event.end)}</p>
        ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
        ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
    `;
    
    detailsEl.classList.remove('hidden');
    
    // Scroll to details
    detailsEl.scrollIntoView({ behavior: 'smooth' });
}

// Hide event details panel
function hideEventDetails() {
    document.getElementById('event-details').classList.add('hidden');
}

// Navigate month (previous/next)
function navigateMonth(direction) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
    renderCalendar(currentDate);
}

// Helper functions
function getMonthName(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
}

function formatDateLong(date) {
    if (!date) return 'Unknown date';
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(date) {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// Get events for a specific day
function getEventsForDay(date) {
    // Simple implementation - doesn't handle multi-day events properly
    return events.filter(event => {
        if (!event.start) return false;
        
        return event.start.getFullYear() === date.getFullYear() &&
               event.start.getMonth() === date.getMonth() &&
               event.start.getDate() === date.getDate();
    });
}
