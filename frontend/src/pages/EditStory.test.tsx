import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import EditStory from './EditStory';
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
          <EditStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const formElement = screen.getByTestId('edit-form');
  expect(formElement).toBeInTheDocument();
});
it('form has text input field', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <EditStory />
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
          <EditStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const fileDropzone = screen.getByText('Drop image/video here or click to upload');
  expect(fileDropzone).toBeInTheDocument();
});
it('toggle to make story public is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <EditStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const toggle = screen.getByRole('checkbox');
  expect(toggle).toBeInTheDocument();
});
it('color input is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <EditStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const colorInput = screen.getByTestId('color-input');
  expect(colorInput).toBeInTheDocument();
});
it('delete button is rendered', () => {
  jest.mock('axios');
  const queryClient = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <EditStory />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  const deleteButton = screen.getByRole('button', { name: 'Delete Story' });
  expect(deleteButton).toBeInTheDocument();
});

jest.clearAllMocks();
