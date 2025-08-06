import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../page';

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText('Seven Wonders')).toBeInTheDocument();
    expect(
      screen.getByText('Welcome to the Seven Wonders monorepo')
    ).toBeInTheDocument();
  });
});
