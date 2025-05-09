import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { requestAuthenticationCheck } from '@/services/authenticationCheckService.js';
import { requestHouseholds } from '@/services/householdService.js';

vi.mock('@/services/authenticationCheckService.js', () => ({
  requestAuthenticationCheck: vi.fn(),
}));

vi.mock('@/services/householdService.js', () => ({
  requestHouseholds: vi.fn(),
}));

describe('userStore', () => {
  let userStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
  });

  it('should initialize with default state', () => {
    expect(userStore.token).toBe(null);
    expect(userStore.authenticated).toBe(false);
    expect(userStore.householdId).toEqual([]);
    expect(userStore.userSettings).toEqual({
      showStorageStatusOnFrontpage: true,
      showHouseholdStatusOnFrontpage: true,
    });
    expect(userStore.isAdmin).toBe(false);
    expect(userStore.adminToken).toBe(null);
  });

  it('should set credentials', () => {
    userStore.setCredentials({
      token: 'test-token',
      authenticated: true,
      householdId: [1, 2],
      adminToken: 'admin-token',
      isAdmin: true,
    });

    expect(userStore.token).toBe('test-token');
    expect(userStore.authenticated).toBe(true);
    expect(userStore.householdId).toEqual([1, 2]);
    expect(userStore.adminToken).toBe('admin-token');
    expect(userStore.isAdmin).toBe(true);
  });

  it('should clear token and reset state', () => {
    userStore.setCredentials({ token: 'test-token', authenticated: true });
    userStore.clearToken();

    expect(userStore.token).toBe(null);
    expect(userStore.authenticated).toBe(false);
    expect(userStore.householdId).toEqual([]);
    expect(userStore.isAdmin).toBe(false);
    expect(userStore.adminToken).toBe(null);
  });

  it('should fetch households and update state', async () => {
    const mockHouseholds = [{ id: 1, name: 'Household 1' }];
    requestHouseholds.mockResolvedValue(mockHouseholds);

    await userStore.fetchHouseholds();

    expect(userStore.householdId).toEqual(mockHouseholds);
  });

  it('should check authentication status', async () => {
    requestAuthenticationCheck.mockResolvedValue(true);

    userStore.token = 'test-token';
    await userStore.isAuthenticated();

    expect(userStore.authenticated).toBe(true);
  });

  it('should return false if no token is present during authentication check', async () => {
    userStore.token = null;
    const result = await userStore.isAuthenticated();

    expect(result).toBe(false);
    expect(userStore.authenticated).toBe(false);
  });

  it('should get household by name', () => {
    userStore.householdId = [{ id: 1, name: 'Test Household' }];
    const household = userStore.getHouseholdByName('Test Household');

    expect(household).toEqual({ id: 1, name: 'Test Household' });
  });

  it('should return isLoggedIn as true if token and authenticated are set', () => {
    userStore.token = 'test-token';
    userStore.authenticated = true;

    expect(userStore.isLoggedIn).toBe(true);
  });
});
