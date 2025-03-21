// Authentication logic for menu.html
if (document.getElementById('auth-form')) {
  let isLoginMode = true;

  // Toggle between login and signup modes
  function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const formTitle = document.getElementById('form-title');
    const submitBtnText = document.getElementById('submit-btn-text');
    const toggleLink = document.getElementById('toggle-link');
    if (isLoginMode) {
      formTitle.textContent = 'Please login to your account!';
      submitBtnText.textContent = 'Login';
      toggleLink.innerHTML = "Don't have an account? <a href=\"#\" onclick=\"toggleAuthMode()\">Sign up</a>";
    } else {
      formTitle.textContent = 'Create a new account';
      submitBtnText.textContent = 'Sign Up';
      toggleLink.innerHTML = 'Already have an account? <a href=\"#\" onclick=\"toggleAuthMode()\">Login</a>';
    }
  }

  // Handle form submission
  document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.querySelector('input[name="uname"]').value.trim();
    const password = document.querySelector('input[name="psw"]').value.trim();
    if (isLoginMode) {
      login(username, password);
    } else {
      signup(username, password);
    }
  });

  function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', username);
      window.location.href = 'main.html';
    } else {
      alert('Invalid username or password');
    }
  }

  function signup(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
      alert('Username already exists');
    } else {
      users.push({ username, password, scores: [] });
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', username);
      window.location.href = 'main.html';
    }
  }
}

// Main page logic for main.html
if (document.getElementById('chatBox')) {
  // Redirect to login if not logged in
  if (!localStorage.getItem('currentUser')) {
    window.location.href = 'menu.html';
  }

  // Chat functionality
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const message = inputField.value.trim();
    if (message === "") return;

    appendMessage(message, "user");
    inputField.value = "";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY_HERE"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices[0].message.content.trim();
      appendMessage(reply, "bot");
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      appendMessage("Sorry, something went wrong. Please try again.", "bot");
    }
  }

  function appendMessage(message, senderClass) {
    const chatBox = document.getElementById("chatBox");
    const messageElem = document.createElement("div");
    messageElem.classList.add("message", senderClass);
    messageElem.textContent = message;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Updated function to change the main phrase and apply the AI's color scheme
  function changeMainPhrase(newText, aiClass) {
    document.getElementById("mainPhrase").textContent = newText;
    document.body.className = aiClass; // Apply the AI-specific class to the body
  }

  // Leaderboard functionality
  function showLeaderboard() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    users.sort((a, b) => Math.max(...(b.scores || [0])) - Math.max(...(a.scores || [0])));
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.username}: ${Math.max(...(user.scores || [0]))}`;
      leaderboardList.appendChild(li);
    });
    document.getElementById('leaderboard').style.display = 'block';
  }

  function hideLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
  }

  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'menu.html';
  }
}

// Made by Isaac