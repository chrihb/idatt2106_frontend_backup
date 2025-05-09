import axios from 'axios';
import {
  getAllAdmins,
  addAdministrator,
  deleteAdministrator,
  passwordResetLinkToAdministrator,
} from '@/services/superAdminService';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('axios');

describe('superAdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add an administrator successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await addAdministrator('admin@example.com');

    expect(axios.post).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('should delete an administrator successfully', async () => {
    axios.delete.mockResolvedValue({ status: 200 });

    const result = await deleteAdministrator(1);

    expect(axios.delete).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('should send a password reset link successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    const result = await passwordResetLinkToAdministrator(1);

    expect(axios.post).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
