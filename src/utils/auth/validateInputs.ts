export interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
}

export interface SignInErrors {
  email?: string;
  password?: string;
}

export function validateRegister(
  name: string,
  email: string,
  password: string,
): RegisterErrors {
  const errors: RegisterErrors = {};

  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length < 2) {
    errors.name = "Enter your first and last name.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Enter a valid email address (example: name@email.com).";
  }

  if (password.length < 8) {
    errors.password = "Password must contain at least 8 characters.";
  }

  return errors;
}

export function validateSignIn(email: string, password: string): SignInErrors {
  const errors: SignInErrors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Enter a valid email address (example: name@email.com).";
  }

  if (password.length < 8) {
    errors.password = "Password must contain at least 8 characters.";
  }

  return errors;
}
