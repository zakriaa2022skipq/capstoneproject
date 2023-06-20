import { render, screen } from '@testing-library/react';
import SortSelect from './SortSelect';

it('select renders ', async () => {
  render(<SortSelect setSort={() => {}} sort="createdAt" />);
  const sortSelect = await screen.findByLabelText('Sort');
  expect(sortSelect).toBeInTheDocument();
});
it('select renders correct option according to the  prop', async () => {
  render(<SortSelect setSort={() => {}} sort="createdAt" />);
  const sortSelect = await screen.findByLabelText('Sort');
  expect(sortSelect).toHaveTextContent('Time');
});
