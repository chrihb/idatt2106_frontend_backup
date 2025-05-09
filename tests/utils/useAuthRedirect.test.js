import { describe, it, expect, vi } from 'vitest';
import { useAuthRedirect } from '@/utils/useAuthRedirect';
import { useRoute, useRouter } from 'vue-router';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
}));

describe('useAuthRedirect', () => {
  it('should return the default redirect path if no query parameter is provided', () => {
    useRoute.mockReturnValue({ query: {} });
    const { redirectPath } = useAuthRedirect('/default-path');
    expect(redirectPath).toBe('/default-path');
  });

  it('should return the redirect path from the query parameter if provided', () => {
    useRoute.mockReturnValue({ query: { redirect: '/custom-path' } });
    const { redirectPath } = useAuthRedirect('/default-path');
    expect(redirectPath).toBe('/custom-path');
  });

  it('should call router.replace with the correct redirect path', () => {
    const mockReplace = vi.fn();
    useRoute.mockReturnValue({ query: { redirect: '/custom-path' } });
    useRouter.mockReturnValue({ replace: mockReplace });

    const { redirectAfterAuth } = useAuthRedirect('/default-path');
    redirectAfterAuth();

    expect(mockReplace).toHaveBeenCalledWith('/custom-path');
  });

  it('should call router.replace with the default path if no query parameter is provided', () => {
    const mockReplace = vi.fn();
    useRoute.mockReturnValue({ query: {} });
    useRouter.mockReturnValue({ replace: mockReplace });

    const { redirectAfterAuth } = useAuthRedirect('/default-path');
    redirectAfterAuth();

    expect(mockReplace).toHaveBeenCalledWith('/default-path');
  });
});
