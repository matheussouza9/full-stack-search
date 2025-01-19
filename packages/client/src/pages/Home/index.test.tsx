import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'

import Home from '.';

const setup = () => {
  const homeComponent = render(<Home />);
  const searchInput = screen.getByPlaceholderText('Search accommodation...');
  return {
    homeComponent,
    searchInput
  }
}

test('renders search input', () => {
  const { searchInput } = setup();
  expect(searchInput).toBeInTheDocument();
});
