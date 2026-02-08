import { validateEmail, validatePassword, validateTitle, validateDescription, validateRequired, validateMaxLength } from '@/utils/validation';

describe('validateEmail', () => {
  it('returns error for empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error for invalid email format', () => {
    expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
    expect(validateEmail('missing@')).toBe('Please enter a valid email address');
    expect(validateEmail('@missing.com')).toBe('Please enter a valid email address');
  });

  it('returns null for valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('test.user@domain.co')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('returns error for empty password', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('returns error for short password', () => {
    expect(validatePassword('1234567')).toBe('Password must be at least 8 characters long');
  });

  it('returns null for valid password', () => {
    expect(validatePassword('12345678')).toBeNull();
    expect(validatePassword('securepassword')).toBeNull();
  });
});

describe('validateTitle', () => {
  it('returns error for empty title', () => {
    expect(validateTitle('')).toBe('Title is required');
    expect(validateTitle('   ')).toBe('Title is required');
  });

  it('returns error for title exceeding 200 chars', () => {
    const longTitle = 'a'.repeat(201);
    expect(validateTitle(longTitle)).toBe('Title must be 200 characters or less');
  });

  it('returns null for valid title', () => {
    expect(validateTitle('My Task')).toBeNull();
    expect(validateTitle('a'.repeat(200))).toBeNull();
  });
});

describe('validateDescription', () => {
  it('returns null for empty/undefined description', () => {
    expect(validateDescription()).toBeNull();
    expect(validateDescription('')).toBeNull();
  });

  it('returns error for description exceeding 1000 chars', () => {
    const longDesc = 'a'.repeat(1001);
    expect(validateDescription(longDesc)).toBe('Description must be 1000 characters or less');
  });

  it('returns null for valid description', () => {
    expect(validateDescription('A task description')).toBeNull();
    expect(validateDescription('a'.repeat(1000))).toBeNull();
  });
});

describe('validateRequired', () => {
  it('returns error for empty value', () => {
    expect(validateRequired('', 'Name')).toBe('Name is required');
    expect(validateRequired('  ', 'Name')).toBe('Name is required');
  });

  it('returns null for non-empty value', () => {
    expect(validateRequired('value', 'Name')).toBeNull();
  });
});

describe('validateMaxLength', () => {
  it('returns error when exceeding max length', () => {
    expect(validateMaxLength('abcde', 3, 'Field')).toBe('Field must be 3 characters or less');
  });

  it('returns null when within limit', () => {
    expect(validateMaxLength('abc', 3, 'Field')).toBeNull();
    expect(validateMaxLength('', 3, 'Field')).toBeNull();
  });
});
