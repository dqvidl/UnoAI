// Authentication logic for login.html
if (document.getElementById('auth-form')) {
  let isLoginMode = true; // Track login/signup mode (not used here but kept for future expansion)

  // Note: login.html uses inline JS now, but this structure is preserved for David's backend
  // Background music and other sounds are handled in login.html inline script
}

// Main page logic for main.html
if (document.getElementById('chatBox')) {
  // Redirect to login if not authenticated (basic check)
  if (!localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
  }

  // Chat functionality is handled inline in main.html for now
  // David can replace this with API calls to the backend
}

// General utility functions (for David's reference)
/**
 * Send message to AI backend (placeholder for David's implementation)
 * @param {string} message - User input
 */
async function sendMessage(message) {
  // Placeholder for David's backend integration
  console.log('Sending message to AI:', message);
  // Example: Call OpenAI API or custom backend
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY_HERE'
      },
      body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }]
      })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
  */
}

/**
 * Append message to chat area (used in main.html inline)
 * @param {string} message - Text to display
 * @param {string} senderClass - 'user' or 'bot'
 */
function appendMessage(message, senderClass) {
  const chatBox = document.getElementById('chatArea'); // Note: ID differs from original
  const messageElem = document.createElement('div');
  messageElem.classList.add('message', senderClass);
  messageElem.textContent = message;
  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Logout function (used in main.html inline)
 */
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Made by Isaac
