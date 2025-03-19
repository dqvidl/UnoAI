// Load existing users from localStorage, or initialize an empty object
const users = JSON.parse(localStorage.getItem("users")) || {};

// Event listener for the Login button
document.getElementById("loginBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Check if the username exists and password matches
    if (users[username] && users[username].password === password) {
        localStorage.setItem("currentUser", username); // Store the logged-in user
        window.location.href = "index.html"; // Redirect to main app
    } else {
        // Display error if credentials are wrong
        document.getElementById("errorMsg").innerText = "Invalid username or password!";
    }
});

// Event listener for the Create Account button
document.getElementById("createAccountBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Check if inputs are valid and username isn’t taken
    if (username && password && !users[username]) {
        users[username] = { password, scores: [] }; // Add new user with empty scores array
        localStorage.setItem("users", JSON.stringify(users)); // Save to localStorage
        localStorage.setItem("currentUser", username); // Log them in
        window.location.href = "index.html"; // Redirect to main app
    } else {
        // Display error if username is taken or inputs are invalid
        document.getElementById("errorMsg").innerText = "Username taken or invalid input!";
    }
});