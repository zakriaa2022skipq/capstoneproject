import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import CreateStory from './CreateStory';
import { store } from '../app/store';

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
          <CreateStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const formElement = screen.getByTestId('create-story-form');
  expect(formElement).toBeInTheDocument();
});
it('form has text input field', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <CreateStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const inputField = screen.getByLabelText('Story text');
  expect(inputField).toBeInTheDocument();
});
it('file dropzone is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <CreateStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const fileDropzone = screen.getByText('Drop image/video here or click to upload');
  expect(fileDropzone).toBeInTheDocument();
});
it('color input is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <CreateStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const colorInput = screen.getByTestId('color-input');
  expect(colorInput).toBeInTheDocument();
});

jest.clearAllMocks();
