import { Controller } from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
	constructor(
		/**
		 * Injecting AuthService
		 */
		private readonly authService: AuthService,
	) {}
}
