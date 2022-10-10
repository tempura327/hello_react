import { render, screen } from '@testing-library/react';
import Contacts from '../src/contacts';

test('renders learn react link', () => {
  render(<Contacts />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
