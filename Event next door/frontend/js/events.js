// Load events when page loads
document.addEventListener('DOMContentLoaded', loadEvents);

async function loadEvents() {
    try {
        showLoading(true);

        const result = await getAllEvents();

        if (result.success && result.events) {
            displayEvents(result.events);
            generateCategoryNavigation(result.events);
        } else {
            showAlert('Failed to load events', 'error');
        }

    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function displayEvents(events) {

    const eventsContainer = document.getElementById('eventsContainer');

    if (!eventsContainer) return;

    eventsContainer.innerHTML = '';

    // Group events by category
    const groupedEvents = {};

    events.forEach(event => {

        const category = event.category || 'Other';

        if (!groupedEvents[category]) {
            groupedEvents[category] = [];
        }

        groupedEvents[category].push(event);
    });

    // Create sections
    Object.entries(groupedEvents).forEach(([category, categoryEvents]) => {

        const categoryId = category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');

        const section = document.createElement('section');
        section.className = 'event-section';
        section.id = categoryId;

        section.innerHTML = `
            <h2 class="category-title">${category}</h2>
        `;

        const grid = document.createElement('div');
        grid.className = 'event-grid';

        categoryEvents.forEach(event => {

            const card = document.createElement('a');

            card.href = `content.html?eventId=${event._id}`;
            card.className = 'event-card';

            card.innerHTML = `
                <div class="event-image">
                    <img 
                        src="${event.image}" 
                        alt="${event.title}"
                        loading="lazy"
                    >
                </div>

                <div class="event-info">
                    <h3>${event.title}</h3>

                    <p>
                        ${event.location || ''}
                    </p>

                    <span class="view-event-btn">
                        View Event
                    </span>
                </div>
            `;

            grid.appendChild(card);
        });

        section.appendChild(grid);
        eventsContainer.appendChild(section);
    });
}

function generateCategoryNavigation(events) {

    const nav = document.querySelector('.link');

    if (!nav) return;

    const bookingLink = nav.querySelector('a[href="my-bookings.html"]');

    nav.innerHTML = '';

    const categories = [...new Set(
        events.map(event => event.category || 'Other')
    )];

    categories.forEach(category => {

        const categoryId = category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');

        const link = document.createElement('a');

        link.href = `#${categoryId}`;
        link.textContent = category;

        nav.appendChild(link);
    });

    if (bookingLink) {
        nav.appendChild(bookingLink);
    }
}

// Search functionality
const searchInput = document.getElementById('searchInput');

if (searchInput) {

    searchInput.addEventListener('input', async (e) => {

        const search = e.target.value;

        try {

            showLoading(true);

            const result = await getAllEvents('', search);

            if (result.success && result.events) {

                displayEvents(result.events);
                generateCategoryNavigation(result.events);
            }

        } catch (error) {

            showAlert(error.message, 'error');

        } finally {

            showLoading(false);
        }
    });
}