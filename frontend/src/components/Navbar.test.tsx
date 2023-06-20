import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { store } from '../app/store';
import Engagement from '../pages/Engagement';
import LeaderBoard from '../pages/LeaderBoard';
import Trending from '../pages/Trending';
import Navbar from './Navbar';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

it('nav links are rendered', () => {
  const queryClient = new QueryClient();

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Navbar />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const trendingLink = screen.getAllByText(/trending/i);
  expect(trendingLink.length).toBe(2);
  const engagementLink = screen.getAllByText(/engagement/i);
  expect(engagementLink.length).toBe(2);
  const leaderboardLink = screen.getAllByText(/leaderboard/i);
  expect(leaderboardLink.length).toBe(2);
});
it('engaement link navigates to engagement page', async () => {
  const queryClient = new QueryClient();
  const user = userEvent.setup();
  const routes = [
    {
      path: '/',
      element: <Navbar />,
    },
    {
      path: '/engagement',
      element: <Engagement />,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/', '/engagement'],
    initialIndex: 0,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>,
  );
  const engagementLink = screen.getAllByText(/engagement/i);
  await user.click(engagementLink[0]);
  const titleText = await screen.findByText('Engagement Stories');
  expect(titleText).toBeInTheDocument();
});
it('leaderboard link navigates to leaderboard page', async () => {
  const queryClient = new QueryClient();
  const user = userEvent.setup();
  const routes = [
    {
      path: '/',
      element: <Navbar />,
    },
    {
      path: '/leaderboard',
      element: <LeaderBoard />,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 0,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>,
  );
  const leaderboardLink = screen.getAllByText(/leaderboard/i);
  await user.click(leaderboardLink[0]);
  const titleText = await screen.findByText('LeaderBoard', { selector: 'span' });
  expect(titleText).toBeInTheDocument();
});
it('trending link navigates to trending page', async () => {
  const queryClient = new QueryClient();
  const user = userEvent.setup();
  const routes = [
    {
      path: '/',
      element: <Navbar />,
    },
    {
      path: '/trending',
      element: <Trending />,
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
    initialIndex: 0,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>,
  );
  const trendingLink = screen.getAllByText(/trending/i);
  await user.click(trendingLink[0]);
  const titleText = await screen.findByText('Trending Stories');
  expect(titleText).toBeInTheDocument();
});
