import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../app/store';
import Register from './Register';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
it('form is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Register />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const formElement = screen.getByTestId('register-form');
  expect(formElement).toBeInTheDocument();
});
it('form has username field', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Register />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const usernameField = screen.getByLabelText('username');
  expect(usernameField).toBeInTheDocument();
});
it('file dropzone is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Register />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const fileDropzone = screen.getByText('Profile Picture');
  expect(fileDropzone).toBeInTheDocument();
});
it('password input is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Register />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const passwordInput = screen.getByLabelText('password');
  expect(passwordInput).toBeInTheDocument();
});

jest.clearAllMocks();
