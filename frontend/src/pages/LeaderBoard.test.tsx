import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { store } from '../app/store';
import LeaderBoard from './LeaderBoard';

const server = setupServer();
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
it('Leaderboard renders with correct information', async () => {
  server.use(
    rest.get('http://localhost/api/v1/story/leaderboard', (req, res, ctx) =>
      res(
        ctx.json({
          leaders: [
            {
              totalStories: 10,
              totalUpvotes: 10,
              user: {
                name: 'john',
                username: 'john',
                profilepic: 'null',
              },
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
          <LeaderBoard />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  mockAllIsIntersecting(true);
  const username = await screen.findByText('Username: john');
  expect(username).toBeInTheDocument();
  const upvotes = await screen.findByText('Total upvotes received: 10');
  expect(upvotes).toBeInTheDocument();
  const stories = await screen.findByText('Total stories posted: 10');
  expect(stories).toBeInTheDocument();
});
it('when server returns error, model with error is rendered', async () => {
  server.use(
    rest.get('http://localhost/api/v1/story/leaderboard', (req, res, ctx) =>
      res(ctx.status(500), ctx.json('something went wrong try again later')),
    ),
  );
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <LeaderBoard />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );

  const textEl = await screen.findByTestId('error message');
  expect(textEl).toBeInTheDocument();
});
