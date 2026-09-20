import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the welcome heading', () => {
  // App hard-codes basename="/dive-with-data" for GitHub Pages, so the
  // router needs a matching URL or it renders nothing in jsdom's default "/".
  window.history.pushState({}, '', '/dive-with-data/');
  render(<App />);
  const heading = screen.getByText(/welcome to dive with data/i);
  expect(heading).toBeInTheDocument();
});
