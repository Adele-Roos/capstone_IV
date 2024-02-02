// server.js

// Importing required modules
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");

// Creating an Express application
const app = express();
const PORT = 3002;

// Middleware setup for CORS, security, and JSON parsing
app.use(cors({ origin: "http://localhost:3000" }));
app.use(helmet());
app.use(express.json());

// Base URL for GitHub API
const API_BASE_URL = "https://api.github.com/";

// Root path route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Route for searching GitHub users by username
app.get("/api/github/search/:username", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/search/users?q=${req.params.username}`
    );
    const users = response.data.items;
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for retrieving GitHub user details and repositories
app.get("/api/github/user/:username", async (req, res) => {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${req.params.username}`),
      axios.get(`https://api.github.com/users/${req.params.username}/repos`),
    ]);

    const user = userResponse.data;
    const repos = reposResponse.data;

    res.json({ user, repos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for retrieving details of a specific GitHub repository
app.get("/api/github/repo/:username/:repoName", async (req, res) => {
  try {
    const { username, repoName } = req.params;

    // Making multiple API calls to gather repository details and last commits
    const repoDetailsResponse = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}`
    );
    const lastCommitsResponse = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/commits?per_page=5`
    );

    // Extracting relevant information from the responses
    const repoDetails = {
      last_commit_date:
        lastCommitsResponse.data[0]?.commit.author.date || "N/A",
      creation_date: repoDetailsResponse.data.created_at,
      last_commits: lastCommitsResponse.data.map(
        (commit) => commit.commit.message
      ),
    };

    // Sending repository details as a JSON response
    res.json(repoDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Starting the server only if not required by a test
if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Exporting the Express app for testing purposes
module.exports = app;
