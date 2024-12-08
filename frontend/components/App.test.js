import React from 'react';
import AppFunctional from './AppFunctional';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

test('sanity', () => {
  expect(true).toBe(true);
});

test('renders submit button', () => {
  render(<AppFunctional />);
  const buttonElement = screen.getByRole('button', { name: 'Submit' }); // Replace with actual button text
  expect(buttonElement).toBeInTheDocument();
});

test('renders input field', () => {
  render(<AppFunctional />);
  const inputElement = screen.getByPlaceholderText('type email'); // Replace with actual placeholder
  expect(inputElement).toBeInTheDocument();
});

test('input value changes on typing', () => {
  render(<AppFunctional />);
  const inputElement = screen.getByPlaceholderText('type email'); // Replace with actual placeholder
  fireEvent.change(inputElement, { target: { value: 'test@example.com' } });
  expect(inputElement.value).toBe('test@example.com');
});

