import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import AuthLayout from './AuthLayout';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

describe('AuthLayout', () =>
 {
  it('should render successfully', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthLayout />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
