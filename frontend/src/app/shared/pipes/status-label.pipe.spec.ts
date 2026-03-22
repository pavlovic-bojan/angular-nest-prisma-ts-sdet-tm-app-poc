import { StatusLabelPipe } from './status-label.pipe';

describe('StatusLabelPipe', () => {
  const pipe = new StatusLabelPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "todo" to "To Do"', () => {
    expect(pipe.transform('todo')).toBe('To Do');
  });

  it('should transform "in-progress" to "In Progress"', () => {
    expect(pipe.transform('in-progress')).toBe('In Progress');
  });

  it('should transform "done" to "Done"', () => {
    expect(pipe.transform('done')).toBe('Done');
  });

  it('should transform "high" to "High"', () => {
    expect(pipe.transform('high')).toBe('High');
  });

  it('should return unknown value as-is', () => {
    expect(pipe.transform('unknown')).toBe('unknown');
  });
});
