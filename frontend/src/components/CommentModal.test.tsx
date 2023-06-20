import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CommentModal from './CommentModal';

it('comment input field is rendered', () => {
  const queryClient = new QueryClient();
  jest.mock('axios');
  render(
    <QueryClientProvider client={queryClient}>
      <CommentModal addCommentModal setAddCommentModal={() => {}} storyId="123" />
    </QueryClientProvider>,
  );
  const inputElement = screen.getByLabelText('comment');
  expect(inputElement).toBeInTheDocument();
  jest.clearAllMocks();
});
