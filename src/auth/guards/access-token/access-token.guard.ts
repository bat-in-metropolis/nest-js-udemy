import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import jwtConfig from "src/auth/config/jwt.config";
import { Request } from "express";
import { REQUEST_USER_KEY } from "src/auth/constants/auth.constants";

@Injectable()
export class AccessTokenGuard implements CanActivate {
	constructor(
		/**
		 * Inject jwtService to validate the token
		 */
		private readonly jwtService: JwtService,

		/**
		 * Injecting jwtConfiguration
		 */
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		/**
		 * Extract the request from the execution context
		 * Extract the token from the Authorization header
		 * Validate the token using jwtService
		 * If valid, allow access (return true)
		 * If invalid, deny access (return false or throw an exception)
		 */

		// Extract the request from the execution context
		const request = context.switchToHttp().getRequest();

		// Extract the token from the Authorization header
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.jwtConfiguration.secret,
			});
			request[REQUEST_USER_KEY] = payload;
			console.log("canActivate", { payload });
		} catch (_) {
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [_, token] = request.headers.authorization?.split(" ") ?? [];
		return token;
	}
}
