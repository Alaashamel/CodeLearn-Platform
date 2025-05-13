document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const chatUsers = document.querySelector('.chat-users');
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.querySelector('.chat-input textarea');
  const sendButton = document.querySelector('.chat-input button');
  const userSearch = document.querySelector('.chat-search input');

  // Sample users data (in a real app, this would come from a backend)
  const users = [
    { id: 1, name: 'John Doe', status: 'online', avatar: '../assets/user-placeholder.png' },
    { id: 2, name: 'Jane Smith', status: 'offline', avatar: '../assets/user-placeholder.png' },
    { id: 3, name: 'Mike Johnson', status: 'online', avatar: '../assets/user-placeholder.png' },
    { id: 4, name: 'Sarah Wilson', status: 'online', avatar: '../assets/user-placeholder.png' }
  ];

  // Sample messages data (in a real app, this would come from a backend)
  const messages = [
    { id: 1, sender: 'John Doe', text: 'Hello everyone!', timestamp: '10:00 AM' },
    { id: 2, sender: 'Jane Smith', text: 'Hi there!', timestamp: '10:01 AM' },
    { id: 3, sender: 'Mike Johnson', text: 'How is everyone doing?', timestamp: '10:02 AM' }
  ];

  function renderUsers(filteredUsers = users) {
    chatUsers.innerHTML = filteredUsers.map(user => `
      <div class="chat-user ${user.status}">
        <img src="${user.avatar}" alt="${user.name}" class="avatar">
        <div class="user-info">
          <span class="user-name">${user.name}</span>
          <span class="user-status">${user.status}</span>
        </div>
      </div>
    `).join('');
  }

  function renderMessages() {
    chatMessages.innerHTML = messages.map(message => `
      <div class="message ${message.sender === user.name ? 'sent' : 'received'}">
        <div class="message-content">
          <span class="message-sender">${message.sender}</span>
          <p>${message.text}</p>
          <span class="message-time">${message.timestamp}</span>
        </div>
      </div>
    `).join('');
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initial render
  renderUsers();
  renderMessages();

  // Search functionality
  userSearch.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm)
    );
    renderUsers(filteredUsers);
  });

  // Send message functionality
  function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText) {
      const newMessage = {
        id: messages.length + 1,
        sender: user.name || 'Guest',
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      messages.push(newMessage);
      renderMessages();
      chatInput.value = '';
    }
  }

  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Simulate real-time updates (in a real app, this would use WebSocket)
  setInterval(() => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    if (Math.random() > 0.7) { // 30% chance of a new message
      const newMessage = {
        id: messages.length + 1,
        sender: randomUser.name,
        text: 'This is a simulated real-time message!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      messages.push(newMessage);
      renderMessages();
    }
  }, 5000);
}); 