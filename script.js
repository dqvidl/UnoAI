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

function changeMainPhrase(newText) {
  document.getElementById("mainPhrase").textContent = newText;
}
