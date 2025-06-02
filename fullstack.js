
  (() => {
    const eventsContainer = document.getElementById('events');
    const loadingIndicator = document.getElementById('loading');
    const modal = document.getElementById('modal');
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const emailOptIn = document.getElementById('emailOptIn');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    const sampleEvents = [
      {
        id: 1,
        title: "Sydney Opera House Concert",
        date: "2024-07-10T19:00:00",
        venue: "Sydney Opera House",
        image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=600&q=80",
       url: "https://www.sydneyoperahouse.com/events"
      },
      {
        id: 2,
        title: "Vivid Sydney Festival",
        date: "2024-08-01T18:00:00",
        venue: "Sydney CBD",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
       url: "https://www.vividsydney.com/"
      },
      {
        id: 3,
        title: "Sydney Food Festival",
        date: "2024-07-20T12:00:00",
        venue: "Darling Harbour",
        image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=600&q=80",
        url: "https://www.sydneyfoodfestival.com.au/"
      },
      {
        id: 4,
        title: "Art Exhibition at Museum",
        date: "2024-07-15T10:00:00",
        venue: "Museum of Contemporary Art",
        image: "https://images.unsplash.com/photo-1464375117522-1311d164eaa6?auto=format&fit=crop&w=600&q=80",
        url: "https://www.mca.com.au/"
      },
      {
        id: 5,
        title: "Harbour Fireworks Night",
        date: "2024-07-14T21:00:00",
        venue: "Sydney Harbour",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        url: "https://www.sydneyfireworks.com/"
      }
    ];

    
    function formatDate(iso) {
      const options = { 
        weekday: 'short', year: 'numeric', month: 'short', 
        day: 'numeric', hour: '2-digit', minute: '2-digit' 
      };
      const dt = new Date(iso);
      return dt.toLocaleDateString('en-AU', options);
    }

    
    function renderEvents(events) {
      eventsContainer.innerHTML = '';
      if(events.length === 0) {
        eventsContainer.innerHTML = '<p>No events found currently. Please check back later.</p>';
        return;
      }
      events.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <img src="${event.image}" alt="${event.title} image" class="event-image" />
          <div class="event-content">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-details"><strong>Date: </strong>${formatDate(event.date)}</p>
            <p class="event-details"><strong>Venue: </strong>${event.venue}</p>
            <button type="button" class="btn-tickets" data-event-id="${event.id}">GET TICKETS</button>
          </div>
        `;
        eventsContainer.appendChild(card);
      });
    }

   
    function fetchEvents() {
      loadingIndicator.hidden = false;
      eventsContainer.setAttribute('aria-busy', 'true');
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(sampleEvents);
        }, 1000);
      });
    }

    
    let activeEvent = null;

    function showModal(event) {
      activeEvent = event;
      emailInput.value = '';
      emailOptIn.checked = false;
      confirmBtn.disabled = true;
      modal.classList.add('active');
      emailInput.focus();
    }

   
    function hideModal() {
      modal.classList.remove('active');
      activeEvent = null;
    }

    // Handle email form input validation
    function handleInputChange() {
      const emailValid = emailInput.checkValidity();
      const optInChecked = emailOptIn.checked;
      confirmBtn.disabled = !(emailValid && optInChecked);
    }

    // On confirm, redirect to event URL
    function handleSubmit(e) {
      e.preventDefault();
      if (!activeEvent) return;

      
      alert(`Thanks for your interest! You will receive emails about "${activeEvent.title}". Redirecting now...`);

      
      window.location.href = activeEvent.url;
    }

    // Event for GET TICKETS button clicks
    eventsContainer.addEventListener('click', e => {
      const target = e.target;
      if (target.matches('.btn-tickets')) {
        const eventId = Number(target.getAttribute('data-event-id'));
        const event = sampleEvents.find(ev => ev.id === eventId);
        if (event) showModal(event);
      }
    });

    
    cancelBtn.addEventListener('click', () => {
      hideModal();
    });

    emailInput.addEventListener('input', handleInputChange);
    emailOptIn.addEventListener('change', handleInputChange);
    emailForm.addEventListener('submit', handleSubmit);

    
    async function loadEvents() {
      loadingIndicator.hidden = false;
      eventsContainer.setAttribute('aria-busy', 'true');
      try {
        const events = await fetchEvents();
        renderEvents(events);
      } catch (err) {
        eventsContainer.innerHTML = '<p>Failed to load events. Please try again later.</p>';
      } finally {
        loadingIndicator.hidden = true;
        eventsContainer.setAttribute('aria-busy', 'false');
      }
    }

    loadEvents();

    
    setInterval(loadEvents, 600000);

    
    document.addEventListener('keydown', e => {
      if (e.key === "Escape" && modal.classList.contains('active')) {
        hideModal();
      }
    });
  })();
