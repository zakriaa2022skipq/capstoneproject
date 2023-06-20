import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../app/store';
import StoryDetail from './StoryDetail';

const server = setupServer();
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
it('story text is rendered', async () => {
  server.use(
    rest.get('http://localhost/api/v1/story/detail/undefined', (req, res, ctx) =>
      res(
        ctx.json({
          story: [
            {
              _id: '10',
              video: null,
              image: null,
              text: 'latest story',
              isPublic: true,
              createdAt: '2023-05-25T04:32:46.795Z',
              updatedAt: '2023-05-30T03:45:54.079Z',
              commentCount: 10,
              upvoteCount: 1,
              downvoteCount: 0,
              hasUpvoted: false,
              hasDownvoted: false,
              author: {
                name: 'john',
                username: 'john3',
              },
              totalUsers: 10,
            },
          ],
        }),
      ),
    ),
    rest.get('http://localhost:5000/api/v1/story/undefined/comment/', (req, res, ctx) =>
      res(
        ctx.json({
          comments: [],
        }),
      ),
    ),
  );
  const queryClient = new QueryClient();

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StoryDetail />
        </Provider>
      </QueryClientProvider>
      ,
    </MemoryRouter>,
  );
  const textEl = await screen.findByText('latest story');
  expect(textEl).toBeInTheDocument();
});
it('comment is rendered', async () => {
  server.use(
    rest.get('http://localhost/api/v1/story/detail/undefined', (req, res, ctx) =>
      res(
        ctx.json({
          story: [
            {
              _id: '10',
              video: null,
              image: null,
              text: 'latest story',
              isPublic: true,
              createdAt: '2023-05-25T04:32:46.795Z',
              updatedAt: '2023-05-30T03:45:54.079Z',
              commentCount: 10,
              upvoteCount: 1,
              downvoteCount: 0,
              hasUpvoted: false,
              hasDownvoted: false,
              author: {
                name: 'john',
                username: 'john3',
              },
              totalUsers: 10,
            },
          ],
        }),
      ),
    ),
    rest.get('http://localhost:5000/api/v1/story/undefined/comment/', (req, res, ctx) =>
      res(
        ctx.json({
          comments: [
            {
              _id: '10',
              storyId: '10',
              text: 'test comment',
              createdAt: '2023-06-17T10:39:37.442Z',
              author: {
                username: 'john',
                profilepic: null,
              },
              isCommentAuthor: false,
            },
          ],
        }),
      ),
    ),
  );
  const queryClient = new QueryClient();

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StoryDetail />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const textEl = await screen.findByText('test comment');
  expect(textEl).toBeInTheDocument();
});
