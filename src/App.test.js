import { render, screen } from '@testing-library/react';
import { expect, it } from '@jest/globals';
import App from './App';

it('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
