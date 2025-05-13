document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const ticketsList = document.querySelector('.tickets-list');
    const ticketStatus = document.getElementById('ticket-status');
    const ticketSearch = document.getElementById('ticket-search');
    const newTicketBtn = document.getElementById('new-ticket-btn');
    const newTicketModal = document.getElementById('new-ticket-modal');
    const newTicketForm = document.getElementById('new-ticket-form');

    // Sample tickets data (in a real app, this would come from a backend)
    const tickets = [
        {
            id: 1,
            subject: 'Cannot access course materials',
            category: 'technical',
            status: 'open',
            description: 'I am unable to access the course materials for Web Development 101.',
            createdAt: '2024-03-15',
            lastUpdated: '2024-03-15'
        },
        {
            id: 2,
            subject: 'Assignment submission issue',
            category: 'academic',
            status: 'in-progress',
            description: 'The system is not accepting my assignment submission.',
            createdAt: '2024-03-14',
            lastUpdated: '2024-03-15'
        },
        {
            id: 3,
            subject: 'Payment confirmation',
            category: 'billing',
            status: 'resolved',
            description: 'I need confirmation of my recent payment.',
            createdAt: '2024-03-13',
            lastUpdated: '2024-03-14'
        }
    ];

    function renderTickets(filteredTickets = tickets) {
        ticketsList.innerHTML = filteredTickets.map(ticket => `
            <div class="ticket-card ${ticket.status}">
                <div class="ticket-header">
                    <h3>${ticket.subject}</h3>
                    <span class="ticket-category">${ticket.category}</span>
                </div>
                <p class="ticket-description">${ticket.description}</p>
                <div class="ticket-footer">
                    <span class="ticket-date">Created: ${ticket.createdAt}</span>
                    <span class="ticket-status">${ticket.status}</span>
                </div>
            </div>
        `).join('');
    }

    // Initial render
    renderTickets();

    // Filter functionality
    ticketStatus.addEventListener('change', function(e) {
        const status = e.target.value;
        let filteredTickets = tickets;
        
        if (status !== 'all') {
            filteredTickets = tickets.filter(ticket => ticket.status === status);
        }
        
        renderTickets(filteredTickets);
    });

    // Search functionality
    ticketSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTickets = tickets.filter(ticket => 
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.description.toLowerCase().includes(searchTerm)
        );
        renderTickets(filteredTickets);
    });

    // Modal functionality
    newTicketBtn.addEventListener('click', function() {
        newTicketModal.style.display = 'block';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === newTicketModal) {
            newTicketModal.style.display = 'none';
        }
    });

    // Form submission
    newTicketForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(newTicketForm);
        const newTicket = {
            id: tickets.length + 1,
            subject: formData.get('subject'),
            category: formData.get('category'),
            status: 'open',
            description: formData.get('description'),
            createdAt: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        tickets.unshift(newTicket);
        renderTickets();
        newTicketModal.style.display = 'none';
        newTicketForm.reset();
    });

    // Cancel button
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        newTicketModal.style.display = 'none';
        newTicketForm.reset();
    });
}); 