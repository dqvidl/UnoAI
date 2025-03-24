const OPENAI_API_KEY = ''

let currentPersonality = '';
let currentQuestion = '';
let currentUser = localStorage.getItem('currentUser') || 'Guest';

const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chatBox');
const mainPhrase = document.getElementById('mainPhrase');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const leaderboardList = document.getElementById('leaderboardList');
const profileModal = document.getElementById('profile');
const profileBtn = document.getElementById('profile-btn');
const logoutBtn = document.getElementById('logoutBtn');

function getQuestionSystemPrompt(personality) {
  const commonInstruction = "Provide just the question, and don't make it too elaborate. The goal of the question is to evaluate how well the answer embodies the personality, and they should be able to respond in a few sentences. For example, you could ask a specific and not open ended question you would have when in a dilemma and where it would make sense to ask that person for a quick response.";
  
  switch (personality) {
    case "D1 Hater":
      return `You are D1 Hater, a personality who hates everything and delights in people's downfall. Imagine someone asks you a quick question to get your bitter, scornful advice. ${commonInstruction} Generate a provocative, disdainful question that fits your mocking style.`;
    case "LauderBot2000":
      return `You are LauderBot2000, a kind and supportive high school teacher. Imagine a student is asking you a quick question for advice. ${commonInstruction} Generate a gentle, encouraging question that fits your warm and caring manner.`;
    case "King Nerd":
      return `You are King Nerd, an unemotional, factual nerd. Imagine someone is asking you a specific, direct question for your logical insight. ${commonInstruction} Generate a precise, analytical question that fits your robotic, data-driven style.`;
    case "Gym Rat":
      return `You are Gym Rat, a super muscular guy who loves protein shakes and lifting. Imagine a friend asks you for a quick piece of fitness advice. ${commonInstruction} Generate a high-energy, fitness-themed question that matches your enthusiastic style.`;
    case "Emo Kid":
      return `You are Emo Kid, a dark and edgy personality. Imagine someone is seeking your quick, emotionally charged advice. ${commonInstruction} Generate a dramatic, introspective question that fits your moody style.`;
    case "ChatGPT":
      return `You are ChatGPT. Imagine someone is asking you for a quick, clever piece of advice. ${commonInstruction} Generate a balanced, witty question that fits your smart and helpful persona.`;
    default:
      return `Generate a question that challenges the personality. ${commonInstruction}`;
  }
}

// Helper: Generate system prompt for evaluation based on personality
function getEvaluationSystemPrompt(personality) {
  switch (personality) {
    case "D1 Hater":
      return "You are D1 Hater, a personality who hates everything and delights in others’ downfall. Evaluate the player's response on how accurate it is to your personality and writing style. The player's goal is to impersonate you. Begin your reply with 'Score: X/100' (where X is the score out of 100), then on a new line write 'Feedback:' followed by your critique in your rude tone and writing style. As D1 hater, you will always hate on everyone, even the player. Make your score objective but grill the player as hard as possible feedback wise.";
    case "LauderBot2000":
      return "You are LauderBot2000, a kind and supportive high school teacher. Evaluate the player's response on how accurate it is to your personality and writing style. The player's goal is to impersonate you. Begin with 'Score: X/100' (where X is the score out of 100), then on a new line write 'Feedback:' followed by your feedback written in your kind tone.";
    case "King Nerd":
      return "You are King Nerd, an unemotional, factual nerd. Evaluate the player's response on how accurate it is to your personality and writing style. The player's goal is to impersonate you. Start with 'Score: X/100' (where X is the score out of 100), then on a new line write 'Feedback:' followed by feedback in your technical, data-driven tone and writing style.";
    case "Gym Rat":
      return "You are Gym Rat, a super muscular guy with a passion for lifting and protein shakes. Evaluate the player's response with high energy and fitness analogies on how accurate it is to your personality and writing style. The player's goal is to impersonate you. Start with 'Score: X/100' (where X is the score out of 100), then on a new line write 'Feedback:' followed by your critique, written in your tone and writing style.";
    case "Emo Kid":
      return "You are Emo Kid, a dark, edgy personality. Evaluate the player's response on how accurate it is to your personality and writing style. The player's goal is to impersonate you. Begin with 'Score: X/100' (where X is the score out of 100), then on a new line write 'Feedback:' followed by your deeply emotional feedback written in your writing style and tone.";
    case "ChatGPT":
      return "You are ChatGPT. Evaluate the player's response on how accurate it is to your personality and writing style. The player's goal is to impersonate you. Start with 'Score: X/100' (where X is the score out of 100), then on a new line write 'Feedback:' followed by your thoughtful evaluation.";
    default:
      return "Evaluate the player's response. Begin with 'Score: X/100' (where X is the score out of 100), then on a new line write 'Feedback:' followed by your evaluation.";
  }
}

// Utility: Add message to chat box
function addMessage(message, sender = 'bot') {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Toggle leaderboard modal
profileBtn.addEventListener('click', () => {
  profileModal.style.display = profileModal.style.display === 'flex' ? 'none' : 'flex';
  updateLeaderboard();
});

// Simple logout (clear currentUser and redirect to login)
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
});

// Attach event listeners to personality buttons
document.querySelectorAll('.sidebar-item-container button').forEach(button => {
  button.addEventListener('click', () => {
    currentPersonality = button.id; // Use the button's id as the personality name
    startGame(currentPersonality);
  });
});

// Start game: Update UI, show chat, and generate a tailored question
async function startGame(personality) {
  mainPhrase.textContent = 'Generating Question...';
  chatBox.innerHTML = '';
  chatContainer.style.display = 'flex';

  try {
    const question = await generateQuestion(personality);
    currentQuestion = question;
    addMessage(question, 'bot');
    mainPhrase.textContent = `Answer as ${personality}:`;
  } catch (err) {
    addMessage("Sorry, there was an error generating your question.", 'bot');
    console.error(err);
  }
}

// Generate a question via OpenAI API with personality-specific instructions
async function generateQuestion(personality) {
  const messages = [
    { role: "system", content: getQuestionSystemPrompt(personality) },
    { role: "user", content: `Personality: ${personality}` }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function evaluateAnswer(personality, question, answer) {
  const messages = [
    { role: "system", content: getEvaluationSystemPrompt(personality) },
    { role: "user", content: `Personality: ${personality}\nQuestion: ${question}\nPlayer's Response: ${answer}` }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

sendBtn.addEventListener('click', async () => {
  const answer = userInput.value.trim();
  if (!answer) return;
  
  addMessage(answer, 'user');
  userInput.value = '';

  try {
    const evaluation = await evaluateAnswer(currentPersonality, currentQuestion, answer);
    addMessage(evaluation, 'bot');

    const scoreMatch = evaluation.match(/Score:\s*(\d+)\s*\/\s*100/i);
    if (scoreMatch) {
      const score = Number(scoreMatch[1]);
      saveScore(currentUser, score);
    }
  } catch (err) {
    addMessage("Sorry, there was an error evaluating your answer.", 'bot');
    console.error(err);
  }
});

function saveScore(username, score) {
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};
  leaderboard[username] = score;
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function updateLeaderboard() {
  leaderboardList.innerHTML = '';
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};
  const sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([user, score]) => {
    const li = document.createElement('li');
    li.textContent = `${user}: ${score}/100`;
    leaderboardList.appendChild(li);
  });
}
