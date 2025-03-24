// --- Authentication Logic for login.html ---
if (document.getElementById('loginForm')) {
  // Logic is handled inline in login.html
  // David can replace the localStorage logic with backend API calls (POST /login, POST /signup)
}

// --- Main Page Logic for main.html ---
if (document.getElementById('chatBox')) {
  // Redirect to login if not authenticated
  if (!localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
  }

  // Continue background music at a lower volume
  const bgMusic = document.getElementById('backgroundMusic');
  if (localStorage.getItem('musicPlaying') === 'true') {
    bgMusic.volume = 0.1; // Lower volume to 10%
    bgMusic.play().catch(error => {
      console.log('Autoplay blocked:', error);
      document.body.addEventListener('click', () => {
        bgMusic.play();
      }, { once: true });
    });
  }

  // Populate leaderboard with sample data
  const leaderboardData = { 'User1': 100, 'User2': 50, 'User3': 30 }; // Sample data
  const leaderboardList = document.getElementById('leaderboardList');
  Object.entries(leaderboardData)
      .sort((a, b) => b[1] - a[1]) // Sort by score (descending)
      .forEach(([user, score]) => {
        const li = document.createElement('li');
        li.textContent = `${user}: ${score}`;
        leaderboardList.appendChild(li);
      });

  // --- For David: Replace leaderboard data with backend API ---
  // Fetch leaderboard data from the server (e.g., GET /leaderboard)
  /*
  async function fetchLeaderboard() {
      const response = await fetch('YOUR_API_ENDPOINT/leaderboard');
      const data = await response.json();
      leaderboardList.innerHTML = '';
      Object.entries(data)
          .sort((a, b) => b[1] - a[1])
          .forEach(([user, score]) => {
              const li = document.createElement('li');
              li.textContent = `${user}: ${score}`;
              leaderboardList.appendChild(li);
          });
  }
  fetchLeaderboard();
  */

  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Function to send the user message and fetch the AI response
  async function sendMessage() {
    let sent = new Audio("message.mp3"); // Load the sound file
    sent.play(); // Play the sound
    const inputField = document.getElementById("userInput");
    const message = inputField.value.trim();
    if (message === "") return;

    // Append user message
    appendMessage(message, "user");
    inputField.value = "";

    // --- For David: Replace with backend chat API ---
    // Send the message to the backend and get the AI response
    /*
    try {
        const response = await fetch('YOUR_API_ENDPOINT/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                personality: document.body.className // Send current AI personality
            })
        });
        const data = await response.json();
        appendMessage(data.reply, "bot");
    } catch (error) {
        console.error("Error fetching AI response:", error);
        appendMessage("Sorry, something went wrong. Please try again.", "bot");
    }
    */

    // Temporary: Echo the message as a bot response (for testing)
    appendMessage(`Echo: ${message}`, "bot");
  }

  // Helper function to append messages to the chat box
  function appendMessage(message, senderClass) {
    const chatBox = document.getElementById("chatBox");
    const messageElem = document.createElement("div");
    messageElem.classList.add("message", senderClass);
    messageElem.textContent = message;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Function to change UI based on AI personality
  function changeUI(newText, num) {
    const body = document.body;
    document.getElementById("mainPhrase").textContent = newText;
    document.getElementById("chat-container").style.display = "flex";
    document.getElementById("chatBox").innerHTML = "";

    // Update body class for theme
    switch (num) {
      case 1:
        body.classList.remove("d1-hater", "lauderbot2000", "king-nerd", "gym-rat", "closet-kid");
        body.classList.add("d1-hater");
        break;
      case 2:
        body.classList.remove("d1-hater", "lauderbot2000", "king-nerd", "gym-rat", "closet-kid");
        body.classList.add("lauderbot2000");
        break;
      case 3:
        body.classList.remove("d1-hater", "lauderbot2000", "king-nerd", "gym-rat", "closet-kid");
        body.classList.add("king-nerd");
        break;
      case 4:
        body.classList.remove("d1-hater", "lauderbot2000", "king-nerd", "gym-rat", "closet-kid");
        body.classList.add("gym-rat");
        break;
      case 5:
        body.classList.remove("d1-hater", "lauderbot2000", "king-nerd", "gym-rat", "closet-kid");
        body.classList.add("closet-kid");
        break;
      default:
        break;
    }
    // --- For David: Notify backend of personality change ---
    // Send the selected personality to the backend
    /*
    fetch('YOUR_API_ENDPOINT/set-personality', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            personality: body.className
        })
    });
    */
  }

  // Toggle leaderboard visibility
  function toggleProfile() {
    let element = document.getElementById("profile");
    if (element.style.display === "none" || element.style.display === "") {
      element.style.display = "flex"; // Show it
    } else {
      element.style.display = "none"; // Hide it
    }
  }

  // Logout function
  function logout() {
    // --- For David: Add backend logout logic ---
    // Clear session on the server and redirect
    localStorage.removeItem('currentUser');
    localStorage.removeItem('musicPlaying');
    window.location.href = 'login.html';
  }

  // Add event listeners on window load
  window.onload = function () {
    document.getElementById("profile-btn").addEventListener("click", toggleProfile);
    document.getElementById("logoutBtn").addEventListener("click", logout);
    document.getElementById("D1 Hater").addEventListener("click", function() { changeUI("Gotta hate em all!", 1); });
    document.getElementById("LauderBot2000").addEventListener("click", function() { changeUI("Who's the best teacher? I am.", 2); });
    document.getElementById("King Nerd").addEventListener("click", function() { changeUI("Erm, actually...", 3); });
    document.getElementById("Gym Rat").addEventListener("click", function() { changeUI("Yeahh buddy! Lightweight!", 4); });
    document.getElementById("Emo Kid").addEventListener("click", function() { changeUI("Do I really have to talk to them...?", 5); });
  };
}

// Made by Isaac and Matthew
