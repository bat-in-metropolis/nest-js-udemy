import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";

@Injectable()
export class AuthService {
	constructor(
		/**
		 * Injecting UsersService
		 */
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
	) {}
	public login(email: string, password: string) {
		/**
		 * Check user exists in database
		 * login
		 * token
		 */
		const user = this.usersService.findOneById("1234");

		return "SAMPLE_TOKEN";
	}

	public isAuth() {
		return true;
	}
}
