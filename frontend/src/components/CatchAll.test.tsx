import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CatchAll from './CatchAll';

it('link to home page is rendered', () => {
  render(
    <MemoryRouter>
      <CatchAll />
    </MemoryRouter>,
  );
  const homeLink = screen.getByText('Go to Home page');
  expect(homeLink).toBeInTheDocument();
});
