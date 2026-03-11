import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { SignInDto } from "../dtos/signIn.dto";
import { SignInProvider } from "./sign-in.provider";

@Injectable()
export class AuthService {
	constructor(
		/**
		 * Injecting UsersService
		 */
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,

		/**
		 * Injecting SignInProvider
		 */
		private readonly signInProvider: SignInProvider,
	) {}
	public async signIn(signInDto: SignInDto) {
		return await this.signInProvider.signIn(signInDto);
	}

	public isAuth() {
		return true;
	}
}
