import { describe, it, expect, vi } from 'vitest';
import { timeSinceEvent } from '@/utils/timeFormat';

describe('timeSinceEvent', () => {
  it('should return the correct time difference in days', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0];
    expect(timeSinceEvent(past)).toBe('3 dager siden');
  });

  it('should return the correct time difference in months', () => {
    const now = new Date();
    const past = new Date(now.setMonth(now.getMonth() - 2)).toISOString().replace('T', ' ').split('.')[0];
    expect(timeSinceEvent(past)).toBe('2 måneder siden');
  });

  it('should return the correct time difference in years', () => {
    const now = new Date();
    const past = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().replace('T', ' ').split('.')[0];
    expect(timeSinceEvent(past)).toBe('1 år siden');
  });
});
