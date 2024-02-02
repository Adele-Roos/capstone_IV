// src/__tests__/Search.test.js

import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import App from "../App";

jest.mock("axios");

test("handles search correctly", async () => {
  // Set the resolved value directly
  axios.get.mockResolvedValue({ data: [{ id: 1, login: "testUser" }] });

  render(<App />);
  const inputElement = screen.getByPlaceholderText("Search for a user");

  fireEvent.change(inputElement, { target: { value: "test" } });
  fireEvent.click(screen.getByText("Search"));

  // Check if the axios.get method was called with the correct URL
  expect(axios.get).toHaveBeenCalledWith(
    "http://localhost:3002/api/github/search/test"
  );

  // Wait for the user to be displayed
  await waitFor(() => {
    expect(screen.getByText("testUser")).toBeInTheDocument();
  });
});
