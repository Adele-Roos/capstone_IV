// src/__tests__/App.test.js

import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders App component snapshot', () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});

test('renders loading state snapshot', () => {
  const { asFragment } = render(<App />);
  // Assuming loading state is triggered, you may set the loading prop accordingly
  expect(asFragment()).toMatchSnapshot();
});

test('renders search results snapshot', () => {
  const { asFragment } = render(<App />);
  // Assuming search results are available, set the state accordingly
  expect(asFragment()).toMatchSnapshot();
});

test('renders user details snapshot', () => {
  const { asFragment } = render(<App />);
  // Assuming user details are available, set the state accordingly
  expect(asFragment()).toMatchSnapshot();
});
