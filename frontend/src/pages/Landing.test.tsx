import { render, screen } from '@testing-library/react';
import Landing from './Landing';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

it('tests for signin and signup link', () => {
  render(<Landing />);
  const signinLink = screen.getByText('Already have an account? Signin');
  const signupLink = screen.getByText("Don't have an account? Signup");
  expect(signinLink).toBeInTheDocument();
  expect(signupLink).toBeInTheDocument();
});
