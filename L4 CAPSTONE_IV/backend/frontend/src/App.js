// src/App.js

// Importing necessary modules and components
import React, { useState, useEffect, useCallback } from "react";
import "./styles.css";
import axios from "axios";
import { act } from "@testing-library/react"; // Importing act from testing-library
import API_BASE_URL from "./config"; // Importing API_BASE_URL from the config file
import { ClipLoader } from "react-spinners";

// Using the variable to prevent the warning
if (API_BASE_URL) {
  console.log(API_BASE_URL);
}

// Main functional component
function App() {
  // State variables to manage user input, search results, selected user, and loading status
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Callback function for handling search functionality
  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);

      await act(async () => {
        // Making an API call to retrieve search results based on the input
        const response = await axios.get(
          `http://localhost:3002/api/github/search/${searchTerm}`
        );

        // Extracting and setting search results
        const results = (response && response.data) || [];
        setSearchResults(results);
      });
    } catch (error) {
      console.error("Error in handleSearch:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Function to handle user click and retrieve user details
  const handleUserClick = async (username) => {
    try {
      setLoading(true);

      // Simulating an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Making an API call to retrieve user details based on the selected username
      const response = await axios.get(
        `http://localhost:3002/api/github/user/${username}`
      );
      setSelectedUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle repository click and retrieve repository details
  const handleRepoClick = async (repoName) => {
    try {
      setLoading(true);

      // Making an API call to retrieve repository details based on the selected user and repoName
      const response = await axios.get(
        `http://localhost:3002/api/github/repo/${selectedUser.user.login}/${repoName}`
      );

      // Updating the repository details in the selectedUser state
      const updatedRepo = {
        ...selectedUser.repos.find((repo) => repo.name === repoName),
        details: response.data,
      };
      const updatedRepos = selectedUser.repos.map((repo) =>
        repo.name === repoName ? updatedRepo : repo
      );
      setSelectedUser((prevUser) => ({
        ...prevUser,
        repos: updatedRepos,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to trigger the search when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm, handleSearch]);

  // Rendered JSX for the component
  return (
    <div className="container">
      <div className="content">
        <h1>Github Explorer</h1>
        {/* Input field for searching users */}
        <input
          type="text"
          placeholder="Search for a user"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <br />

        {/* Loading spinner while data is being fetched */}
        {loading && <ClipLoader color="#022c0c" loading={loading} size={35} />}

        {/* Displaying search results if available */}
        {searchResults && searchResults.length > 0 && (
          <div>
            <h2>Search Results</h2>
            <ul>
              {/* Mapping through search results and rendering user items */}
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserClick(user.login)}
                  data-testid={`user-item-${user.login}`}
                >
                  {user.login}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Displaying user details if a user is selected */}
      {selectedUser && (
        <div className="content">
          <h2>User Details</h2>
          {/* Displaying user information */}
          <p data-testid="user-name">
            <strong className="user_details">GitHub Name:</strong>{" "}
            <a
              href={selectedUser.user.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedUser.user.login}
            </a>{" "}
            <br />
            <strong className="user_details">Full Name:</strong>{" "}
            {selectedUser.user.name}
          </p>
          <img
            src={selectedUser.user.avatar_url}
            alt={`${selectedUser.user.login}'s avatar`}
          />
          <p data-testid="user-bio">{selectedUser.user.bio}</p>

          {/* Displaying user repositories */}
          <h3>REPOSITORIES</h3>
          <ul>
            {/* Mapping through user repositories and rendering repo details */}
            {selectedUser.repos.map((repo) => (
              <li key={repo.id}>
                <strong>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.name}
                  </a>
                </strong>
                <p>{repo.description}</p>
                {/* Displaying additional repo details if available */}
                {repo.details && (
                  <div>
                    <p>
                      <strong>Last Commit Date:</strong>{" "}
                      {repo.details.last_commit_date || "N/A"}
                    </p>
                    <p>
                      <strong>Creation Date:</strong>{" "}
                      {repo.details.creation_date}
                    </p>
                    <h4>LAST 5 COMMITS:</h4>
                    <ul className="commits">
                      {/* Mapping through last commits and rendering them */}
                      {repo.details.last_commits.map((commit, index) => (
                        <li key={index}>{commit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Button to load repository details */}
                <button onClick={() => handleRepoClick(repo.name)}>
                  Load Repo Details
                </button>
                <hr></hr>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
