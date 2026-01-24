import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamsDto } from "../dtos/get-users-params.dto";
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
	public findAll(
		getUsersParamsDto: GetUsersParamsDto,
		limit: number,
		page: number,
	) {
		const isAuthenticated = this.authService.isAuth();
		console.log({ isAuthenticated });
		return [
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
		];
	}

	/**
	 * Find a user by ID
	 */
	public findOneById(id: string) {
		return {
			id: 1234,
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
		};
	}
}
