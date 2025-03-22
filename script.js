// Authentication logic for login.html
if (document.getElementById('auth-form')) {
  let isLoginMode = true; // Track whether in login or signup mode

  // Start background music on page load
  const backgroundMusic = document.getElementById('backgroundMusic');
  backgroundMusic.play();

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
    // Play click sound for user feedback
    document.getElementById('clickSound').play();
  }

  // Handle form submission for login/signup
  document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.querySelector('input[name="uname"]').value.trim();
    const password = document.querySelector('input[name="psw"]').value.trim();
    if (isLoginMode) {
      login(username, password);
    } else {
      signup(username, password);
    }
    // Play click sound on submission
    document.getElementById('clickSound').play();
  });

  // Login function: authenticate user and redirect
  function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', username);
      window.location.href = 'main.html';
    } else {
      alert('Invalid username or password');
      document.getElementById('errorSound').play(); // Error sound for failed login
    }
  }

  // Signup function: register new user and redirect
  function signup(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
      alert('Username already exists');
      document.getElementById('errorSound').play(); // Error sound for duplicate username
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
  // Redirect to login if not authenticated
  if (!localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
  }

  // Add event listeners for chat input
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });

  // Send message to AI and display response
  async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const message = inputField.value.trim();
    if (message === "") return;

    appendMessage(message, "user");
    inputField.value = "";
    document.getElementById('sendSound').play(); // Play send sound

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY_HERE" // David to replace with actual key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        })
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      const reply = data.choices[0].message.content.trim();
      appendMessage(reply, "bot");
      document.getElementById('receiveSound').play(); // Play receive sound
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      appendMessage("Sorry, something went wrong. Please try again.", "bot");
      document.getElementById('errorSound').play(); // Play error sound
    }
  }

  // Append message to chat box
  function appendMessage(message, senderClass) {
    const chatBox = document.getElementById("chatBox");
    const messageElem = document.createElement("div");
    messageElem.classList.add("message", senderClass);
    messageElem.textContent = message;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
  }

  // Change main phrase and apply AI theme
  function changeMainPhrase(newText, aiClass) {
    document.getElementById("mainPhrase").textContent = newText;
    document.body.className = aiClass; // Apply AI-specific theme
    document.getElementById('clickSound').play(); // Play click sound
  }

  // Display leaderboard with user scores
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
    document.getElementById('clickSound').play(); // Play click sound
  }

  // Hide leaderboard modal
  function hideLeaderboard() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('clickSound').play(); // Play click sound
  }

  // Logout and redirect to login page
  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
    document.getElementById('clickSound').play(); // Play click sound
  }
}

// Made by Isaac
