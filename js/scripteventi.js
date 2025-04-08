
        document.addEventListener('DOMContentLoaded', function() {
            // Configuration
            const CALENDAR_URL = 'https://calendar.google.com/calendar/ical/7c0d54c8fa499b1b991499814860f2094eee53babcee50f8e75ef45b4b64c223%40group.calendar.google.com/public/basic.ics';
            
            // State
            let events = [];
            let filteredEvents = [];
            let currentFilter = 'all';
            let currentMonth = 'all';
            let searchQuery = '';

            // DOM Elements
            const eventsContainer = document.getElementById('events-container');
            const allBtn = document.getElementById('all-btn');
            const publicBtn = document.getElementById('public-btn');
            const privateBtn = document.getElementById('private-btn');
            const searchInput = document.getElementById('search');
            const monthTabs = document.querySelectorAll('.month-tab');

            // Event Listeners
            allBtn.addEventListener('click', () => {
                setActiveButton(allBtn);
                currentFilter = 'all';
                filterAndDisplayEvents();
            });

            publicBtn.addEventListener('click', () => {
                setActiveButton(publicBtn);
                currentFilter = 'public';
                filterAndDisplayEvents();
            });

            privateBtn.addEventListener('click', () => {
                setActiveButton(privateBtn);
                currentFilter = 'private';
                filterAndDisplayEvents();
            });

            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                filterAndDisplayEvents();
            });

            monthTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    monthTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    currentMonth = tab.dataset.month;
                    filterAndDisplayEvents();
                });
            });

            // Functions
            function setActiveButton(button) {
                allBtn.classList.remove('active');
                publicBtn.classList.remove('active');
                privateBtn.classList.remove('active');
                button.classList.add('active');
            }

            function formatDate(dateStr) {
                const date = new Date(dateStr);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return date.toLocaleDateString('it-IT', options);
            }

            function formatDateRange(startDate, endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                // Subtract one day from end date because ICS format uses exclusive end dates
                end.setDate(end.getDate() - 1);
                
                const startFormatted = start.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
                
                // If it's a one-day event
                if (start.getTime() === end.getTime()) {
                    return startFormatted;
                }
                
                const endFormatted = end.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
                return `${startFormatted} - ${endFormatted}`;
            }

            function parseICalEvents(icalData) {
                const jcalData = ICAL.parse(icalData);
                const comp = new ICAL.Component(jcalData);
                const vevents = comp.getAllSubcomponents('vevent');
                
                const parsedEvents = vevents.map(vevent => {
                    const event = new ICAL.Event(vevent);
                    
                    // Get start and end dates
                    const startDate = event.startDate.toJSDate();
                    const endDate = event.endDate.toJSDate();
                    
                    // Skip recurring event definitions (we'll handle expanded instances separately)
                    if (event.isRecurring()) {
                        return null;
                    }
                    
                    // Extract categories and determine if event is public or private
                    let categories = vevent.getFirstPropertyValue('categories') || '';
                    let accessType = vevent.getFirstPropertyValue('class') || 'PUBLIC';
                    
                    // Determine if public or private
                    let isPublic = true;
                    if (categories.includes('PRIVATO') || accessType === 'PRIVATE') {
                        isPublic = false;
                    }
                    
                    return {
                        id: event.uid,
                        title: event.summary,
                        startDate: startDate,
                        endDate: endDate,
                        location: event.location || 'Non specificata',
                        description: event.description || 'Nessuna descrizione disponibile',
                        isPublic: isPublic,
                        month: startDate.getMonth() + 1 // 1-based month
                    };
                }).filter(e => e !== null);
                
                // Handle recurring events
                vevents.forEach(vevent => {
                    const event = new ICAL.Event(vevent);
                    
                    if (event.isRecurring()) {
                        const startYear = new Date().getFullYear();
                        const endYear = startYear + 1;
                        
                        try {
                            const expand = new ICAL.RecurExpansion({
                                component: vevent,
                                dtstart: event.startDate
                            });
                            
                            let next;
                            while ((next = expand.next())) {
                                const occurrenceDate = next.toJSDate();
                                
                                // Only include occurrences in the current or next year
                                if (occurrenceDate.getFullYear() >= startYear && occurrenceDate.getFullYear() <= endYear) {
                                    const endDate = new Date(occurrenceDate);
                                    
                                    // Calculate end date based on duration
                                    if (event.duration) {
                                        endDate.setSeconds(endDate.getSeconds() + event.duration.toSeconds());
                                    } else {
                                        // Default to 1 hour if no duration
                                        endDate.setHours(endDate.getHours() + 1);
                                    }
                                    
                                    // Extract categories and determine if event is public or private
                                    let categories = vevent.getFirstPropertyValue('categories') || '';
                                    let accessType = vevent.getFirstPropertyValue('class') || 'PUBLIC';
                                    
                                    // Determine if public or private
                                    let isPublic = true;
                                    if (categories.includes('PRIVATO') || accessType === 'PRIVATE') {
                                        isPublic = false;
                                    }
                                    
                                    parsedEvents.push({
                                        id: `${event.uid}-${occurrenceDate.getTime()}`,
                                        title: event.summary,
                                        startDate: occurrenceDate,
                                        endDate: endDate,
                                        location: event.location || 'Non specificata',
                                        description: event.description || 'Nessuna descrizione disponibile',
                                        isPublic: isPublic,
                                        month: occurrenceDate.getMonth() + 1 // 1-based month
                                    });
                                }
                            }
                        } catch (e) {
                            console.error('Error expanding recurring event:', e);
                        }
                    }
                });
                
                // Sort events by start date
                return parsedEvents.sort((a, b) => a.startDate - b.startDate);
            }

            function filterAndDisplayEvents() {
                filteredEvents = events.filter(event => {
                    // Filter by type (public/private)
                    if (currentFilter === 'public' && !event.isPublic) return false;
                    if (currentFilter === 'private' && event.isPublic) return false;
                    
                    // Filter by month
                    if (currentMonth !== 'all' && event.month !== parseInt(currentMonth)) return false;
                    
                    // Filter by search query
                    if (searchQuery) {
                        const query = searchQuery.toLowerCase();
                        return event.title.toLowerCase().includes(query) || 
                               event.description.toLowerCase().includes(query) ||
                               event.location.toLowerCase().includes(query);
                    }
                    
                    return true;
                });
                
                displayEvents();
            }

            function displayEvents() {
                if (filteredEvents.length === 0) {
                    eventsContainer.innerHTML = `
                        <div class="no-events">
                            <h3>Nessun evento trovato</h3>
                            <p>Prova a modificare i filtri o la ricerca.</p>
                        </div>
                    `;
                    return;
                }
                
                let html = '<div class="events-grid">';
                
                filteredEvents.forEach(event => {
                    html += `
                        <div class="event-card">
                            <div class="event-header">
                                <div class="event-date">
                                    <i class="far fa-calendar"></i>
                                    ${formatDateRange(event.startDate, event.endDate)}
                                </div>
                                <h3 class="event-title">${event.title}</h3>
                                <div class="event-type ${event.isPublic ? 'public' : 'private'}">
                                    ${event.isPublic ? 'Pubblico' : 'Privato'}
                                </div>
                            </div>
                            <div class="event-body">
                                <div class="event-info">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <p>${event.location}</p>
                                </div>
                                <div class="event-info">
                                    <i class="fas fa-info-circle"></i>
                                    <p>${event.description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += '</div>';
                eventsContainer.innerHTML = html;
            }

            // Fetch calendar data
            fetch(CALENDAR_URL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    events = parseICalEvents(data);
                    filterAndDisplayEvents();
                })
                .catch(error => {
                    console.error('Error fetching calendar data:', error);
                    eventsContainer.innerHTML = `
                        <div class="no-events">
                            <h3>Errore nel caricamento degli eventi</h3>
                            <p>Si è verificato un problema durante il caricamento del calendario. Riprova più tardi.</p>
                        </div>
                    `;
                });
        });
    