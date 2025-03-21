// Event listeners for sending a message by clicking the button or pressing Enter
document.getElementById("sendBtn").addEventListener("click", sendMessage);

document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Function to send the user message and fetch the GPT response
async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const message = inputField.value.trim();
  if (message === "") return;

  // Append user message
  appendMessage(message, "user");
  inputField.value = "";

  try {
    // Make the API call to GPT
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Replace YOUR_API_KEY_HERE with your actual API key.
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

// Helper function to append messages to the chat box
function appendMessage(message, senderClass) {
  const chatBox = document.getElementById("chatBox");
  const messageElem = document.createElement("div");
  messageElem.classList.add("message", senderClass);
  messageElem.textContent = message;
  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}


function changeUI(newText) {
  document.getElementById("mainPhrase").textContent = newText;
  document.getElementById("chat-container").style.display = "flex" ;
  document.getElementById("chatBox").innerHTML = "";
}
window.onload = function () {
  document.getElementById("profile-btn").addEventListener("click", toggleProfile);
  document.getElementById("D1 Hater").addEventListener("click", () => changeUI("Gotta hate em all!"));
  document.getElementById("LauderBot2000").addEventListener("click", () => changeUI("Who's the best teacher? I am."));
  document.getElementById("King Nerd").addEventListener("click", () => changeUI("Erm, actually..."));
  document.getElementById("Gym Rat").addEventListener("click", () => changeUI("Yeahh buddy! Lightweight!"));
  document.getElementById("Closet Kid").addEventListener("click", () => changeUI("Do I really have to talk to them...?"));
};

  function toggleProfile() {
  let element = document.getElementById("profile");

  if (element.style.display === "none") {
      element.style.display = "flex"; // Show it
  } else {
      element.style.display = "none"; // Hide it
  }
}
