import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";

/**
 * Class to connect to Users table and perform buisness operations
 */
@Injectable()
export class UsersService {
	/**
	 * Auth service used for authentication checks
	 */
	private readonly authService: AuthService;

	constructor(
		@Inject(forwardRef(() => AuthService))
		authService: AuthService,
	) {
		this.authService = authService;
	}

	/**
	 * The method to get all the users from the database
	 * @param limit The number of users to return
	 * @param page The page number
	 * @returns The users and pagination information
	 */
	public findAll(limit: number, page: number) {
		const isAuthenticated = this.authService.isAuth();
		console.log({ isAuthenticated });
		return {
			users: [
				{
					firstName: "John",
					lastName: "Doe",
					email: "john.doe@example.com",
				},
				{
					firstName: "Alice",
					lastName: "Watson",
					email: "alice.watson@example.com",
				},
			],
			pagination: {
				limit,
				page,
			},
		};
	}

	/**
	 * The method to get a single user by ID
	 * @param id The user ID
	 * @returns The user
	 */
	public findOneById(id: number) {
		return {
			id,
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
		};
	}
}
