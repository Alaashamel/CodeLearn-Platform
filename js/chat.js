document.addEventListener('DOMContentLoaded', function() {
  var chatBox = document.getElementById('chat-box');
  var chatForm = document.getElementById('chat-form');
  var chatInput = document.getElementById('chat-input');
  var typingIndicator = document.createElement('div');
  typingIndicator.id = 'typing-indicator';
  typingIndicator.style.color = '#4F8CFF';
  typingIndicator.style.margin = '0.5rem 0';
  typingIndicator.textContent = 'User is typing...';
  typingIndicator.style.display = 'none';
  if (chatBox) chatBox.parentNode.insertBefore(typingIndicator, chatBox.nextSibling);

  // Online status (demo: always online)
  var onlineDot = document.createElement('span');
  onlineDot.style.display = 'inline-block';
  onlineDot.style.width = '10px';
  onlineDot.style.height = '10px';
  onlineDot.style.background = '#43E97B';
  onlineDot.style.borderRadius = '50%';
  onlineDot.style.marginRight = '0.5rem';
  var header = document.querySelector('.main-content h1');
  if (header) header.prepend(onlineDot);

  // Typing indicator logic
  if (chatInput) {
    chatInput.addEventListener('input', function() {
      typingIndicator.style.display = chatInput.value ? 'block' : 'none';
      // Simulate other user typing (demo)
      setTimeout(function() { typingIndicator.style.display = 'none'; }, 2000);
    });
  }
}); 