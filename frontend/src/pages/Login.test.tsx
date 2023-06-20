import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../app/store';
import Login from './Login';

describe('sigin input fields work correctly', () => {
  it('username input works correctly', () => {
    const queryClient = new QueryClient();

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Login />
          </Provider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
    const usernameInput = screen.getByLabelText<HTMLInputElement>('Username');
    fireEvent.change(usernameInput, { target: { value: 'john' } });
    expect(usernameInput.value).toBe('john');
  });
  it('password input works correctly', () => {
    const queryClient = new QueryClient();

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Login />
          </Provider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
    const usernameInput = screen.getByLabelText<HTMLInputElement>('Password');
    fireEvent.change(usernameInput, { target: { value: '12345' } });
    expect(usernameInput.value).toBe('12345');
  });
});
