export const validationPatterns = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  username: /^[a-zA-Z0-9_]+$/,
  password: /^.{6,}$/,
};

export const validationMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, length: number) => 
    `${field} must be at least ${length} characters`,
  maxLength: (field: string, length: number) => 
    `${field} cannot exceed ${length} characters`,
  pattern: (field: string) => `${field} format is invalid`,
  email: 'Please enter a valid email address',
  username: 'Username can only contain letters, numbers, and underscores',
  passwordMatch: 'Passwords do not match',
};

export const validateEmail = (email: string): boolean => {
  return validationPatterns.email.test(email);
};

export const validateUsername = (username: string): boolean => {
  return validationPatterns.username.test(username) && 
         username.length >= 3 && 
         username.length <= 30;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.length <= 50;
};
