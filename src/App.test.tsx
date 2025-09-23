import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    // Should render the browse recipes page for authenticated users
    expect(screen.getByText(/Discover Healthy Recipes/i)).toBeInTheDocument();
  });
});