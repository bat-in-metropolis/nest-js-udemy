/**
 * Centralized error messages used across the application
 */
export const ERROR_MESSAGES = {
	/**
	 * Database related error messages
	 */
	DATABASE: {
		CONNECTION_TIMEOUT:
			"Unable to process your request at the moment, please try later.",
		CONNECTION_TIMEOUT_DESCRIPTION: "Error connecting to the database",
	},
	/**
	 * User related error messages
	 */
	USER: {
		ALREADY_EXISTS: "The user already exists, please check your email",
		NOT_FOUND: "User not found",
		USER_DOES_NOT_EXIST: "The user id does not exist",
	},
	/**
	 * Authentication related error messages
	 */
	AUTH: {
		INVALID_CREDENTIALS:
			"Invalid credentials. Please check your email and password.",
		SIGN_IN_TIMEOUT:
			"Unable to process sign in request at the moment. Please try again later.",
		SIGN_IN_TIMEOUT_DESCRIPTION: "Error occurred during sign in process",
	},
} as const;
