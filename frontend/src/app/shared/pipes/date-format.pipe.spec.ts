import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  const pipe = new DateFormatPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform valid ISO date string', () => {
    const result = pipe.transform('2025-02-20T10:00:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return empty string for empty value', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return empty string for null/undefined-like', () => {
    expect(pipe.transform(null as unknown as string)).toBe('');
  });
});
