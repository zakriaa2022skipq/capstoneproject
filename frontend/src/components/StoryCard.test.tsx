import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import StoryCard from './StoryCard';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Story Card test', () => {
  jest.mock('axios');
  it('story text is rendered', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StoryCard
            story={{
              _id: '123',
              author: { username: 'john', profilepic: '/123' },
              commentCount: 5,
              createdAt: new Date().toString(),
              downvoteCount: 5,
              upvoteCount: 5,
              hasDownvoted: true,
              hasUpvoted: false,
              isFollowingAuthor: true,
              style: { color: '#ffddee' },
              totalUsers: 20,
              text: 'hello story text',
            }}
            viewCommentOption
            viewEditOption
            viewFollowOption
          />
          ,
        </Provider>
      </QueryClientProvider>,
    );
    const textEl = screen.getByText('hello story text', { selector: 'p' });
    expect(textEl).toBeInTheDocument();
  });
  it('upvote button is rendered', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StoryCard
            story={{
              _id: '123',
              author: { username: 'john', profilepic: '/123' },
              commentCount: 5,
              createdAt: new Date().toString(),
              downvoteCount: 5,
              upvoteCount: 5,
              hasDownvoted: true,
              hasUpvoted: false,
              isFollowingAuthor: true,
              style: { color: '#ffddee' },
              totalUsers: 20,
              text: 'hello story text',
            }}
            viewCommentOption
            viewEditOption
            viewFollowOption
          />
          ,
        </Provider>
      </QueryClientProvider>,
    );
    const upvoteButton = screen.getByLabelText('upvote');
    expect(upvoteButton).toBeInTheDocument();
  });
  it('downvote button is rendered', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StoryCard
            story={{
              _id: '123',
              author: { username: 'john', profilepic: '/123' },
              commentCount: 5,
              createdAt: new Date().toString(),
              downvoteCount: 5,
              upvoteCount: 5,
              hasDownvoted: true,
              hasUpvoted: false,
              isFollowingAuthor: true,
              style: { color: '#ffddee' },
              totalUsers: 20,
              text: 'hello story text',
            }}
            viewCommentOption
            viewEditOption
            viewFollowOption
          />
          ,
        </Provider>
      </QueryClientProvider>,
    );
    const upvoteButton = screen.getByLabelText('downvote');
    expect(upvoteButton).toBeInTheDocument();
  });

  jest.resetAllMocks();
});
