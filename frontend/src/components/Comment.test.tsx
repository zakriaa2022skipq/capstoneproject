import { render, screen } from '@testing-library/react';
import Comment from './Comment';

it('rendeners comment text', () => {
  render(
    <Comment
      comment={{
        _id: '123',
        storyId: '123',
        text: 'comment added',
        createdAt: new Date().toString(),
        author: {
          username: 'user',
          profilepic: '/image',
        },
        isCommentAuthor: false,
      }}
    />,
  );
  const trendingLink = screen.getByText(/comment added/i);
  expect(trendingLink).toBeInTheDocument();
});
it('rendeners author username', () => {
  render(
    <Comment
      comment={{
        _id: '123',
        storyId: '123',
        text: 'comment added',
        createdAt: new Date().toString(),
        author: {
          username: 'user',
          profilepic: '/image',
        },
        isCommentAuthor: false,
      }}
    />,
  );
  const trendingLink = screen.getByText(/user/i);
  expect(trendingLink).toBeInTheDocument();
});
