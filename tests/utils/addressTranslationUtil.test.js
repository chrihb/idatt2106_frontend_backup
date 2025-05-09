import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getAddress, getCoordinates, getAddressSuggestions } from '@/utils/addressTranslationUtil';

vi.mock('axios');

describe('addressTranslationUtil', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and format an address', async () => {
    axios.get.mockResolvedValue({
      data: { address: { road: 'Test Road', house_number: '123', city: 'Test City' } },
    });

    const address = await getAddress(10, 20, { brief: false });
    expect(address).toBe('Test Road 123, Test City');
  });

  it('should return brief address if specified', async () => {
    axios.get.mockResolvedValue({
      data: { address: { road: 'Test Road' } },
    });

    const address = await getAddress(10, 20, { brief: true });
    expect(address).toBe('Test Road');
  });

  it('should fetch coordinates for a full address', async () => {
    axios.get.mockResolvedValue({
      data: [{ lat: '10.123', lon: '20.456' }],
    });

    const coordinates = await getCoordinates({
      street: 'Test Street',
      postalcode: '12345',
      city: 'Test City',
    });

    expect(coordinates).toEqual({ lat: 10.123, lon: 20.456, status: 'full' });
  });

  it('should return "not found" if no coordinates are found', async () => {
    axios.get.mockResolvedValue({ data: [] });

    const coordinates = await getCoordinates({
      street: 'Unknown Street',
      postalcode: '00000',
      city: 'Unknown City',
    });

    expect(coordinates.status).toBe('not found');
  });

  it('should debounce address suggestions', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          address: { road: 'Test Road', city: 'Test City' },
          lat: '10.123',
          lon: '20.456',
        },
      ],
    });

    const suggestions = await getAddressSuggestions('Test Query');
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].displayName).toBe('Test Road, Test City');
  });
});
