import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../app/store';
import PersonalStories from './PersonalStories';

const server = setupServer();
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
it('when server returns no stories correct text is rendered', async () => {
  server.use(rest.get('http://localhost/api/v1/story/all', (req, res, ctx) => res(ctx.json({ stories: [] }))));
  const queryClient = new QueryClient();

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersonalStories />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const textEl = await screen.findByText('You have not posted any stories. Post stories and they will show up here.');
  expect(textEl).toBeInTheDocument();
});
it('when server returns error, model with error is rendered', async () => {
  server.use(
    rest.get('http://localhost/api/v1/story/all', (req, res, ctx) =>
      res(ctx.status(500), ctx.json('something went wrong try again later')),
    ),
  );
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersonalStories />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );

  const textEl = await screen.findByTestId('error message');
  expect(textEl).toBeInTheDocument();
});
