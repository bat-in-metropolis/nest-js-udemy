import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";

@Injectable()
export class UsersService {
	constructor(
		/**
		 * Injecting AuthService
		 */
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {}
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
	 * Find a user by ID
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
