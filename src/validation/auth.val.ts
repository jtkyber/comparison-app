export function validateLogin(username: string, password: string): string | 'passed' {
	if (!username.length) return 'Please enter a username';
	else if (!password.length) return 'Please enter a password';

	return 'passed';
}

export function validateRegister(
	username: string,
	password: string,
	confirmPassword: string
): string | 'passed' {
	if (!username.length) {
		return 'Please enter a username';
	} else if (username.length < 4) {
		return 'Username must be at least 4 characters';
	} else if (username.length > 36) {
		return 'Username must be under 36 characters';
	} else if (password !== confirmPassword) {
		return 'Passwords do not match';
	} else if (!password.length) {
		return 'Please enter a password';
	} else if (password.length < 6) {
		return 'Password must be at least 6 characters';
	}

	return 'passed';
}
