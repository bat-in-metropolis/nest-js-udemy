import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { ApiTags } from "@nestjs/swagger";
import { SignInDto } from "./dtos/signIn.dto";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
	constructor(
		/**
		 * Injecting AuthService
		 */
		private readonly authService: AuthService,
	) {}

	@Post("sign-in")
	@HttpCode(HttpStatus.OK)
	public async signIn(@Body() signInDto: SignInDto) {
		return await this.authService.signIn(signInDto);
	}
}
