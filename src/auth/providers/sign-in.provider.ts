import {
	forwardRef,
	Inject,
	Injectable,
	RequestTimeoutException,
	UnauthorizedException,
} from "@nestjs/common";
import { SignInDto } from "../dtos/signIn.dto";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/providers/users.service";
import { HashingProvider } from "./hashing.provider";
import { JwtService } from "@nestjs/jwt";
import type { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { ERROR_MESSAGES } from "src/common/constants/error-messages.constants";

@Injectable()
export class SignInProvider {
	constructor(
		/**
		 * Injecting UsersService
		 */
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,

		/**
		 * Injecting hashing provider
		 */
		private readonly hashingProvider: HashingProvider,

		/**
		 * Injecting JWT service
		 */
		private readonly jwtService: JwtService,

		/**
		 * Injecting jwtConfiguration
		 */
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
	) {}
	public async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
		/**
		 * Find the user by email
		 * If user not found, throw generic error (security)
		 * If user found, compare the password
		 * If password does not match, throw generic error (security)
		 * If password matches, generate and return JWT token
		 */
		let user: User | null = null;

		// Find the user by email - handle DB errors
		try {
			user = await this.usersService.findOneByEmail(signInDto.email);
		} catch (error) {
			// Database error - infrastructure issue
			throw new RequestTimeoutException(ERROR_MESSAGES.AUTH.SIGN_IN_TIMEOUT, {
				description: ERROR_MESSAGES.AUTH.SIGN_IN_TIMEOUT_DESCRIPTION,
			});
		}

		// User not found - return generic error for security (prevent email enumeration)
		if (!user) {
			throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
		}

		// Compare the password - handle bcrypt errors
		let isPasswordMatch = false;
		try {
			isPasswordMatch = await this.hashingProvider.comparePassword(
				signInDto.password,
				user.password,
			);
		} catch (error) {
			// Password comparison error - infrastructure issue
			throw new RequestTimeoutException(ERROR_MESSAGES.AUTH.SIGN_IN_TIMEOUT, {
				description: ERROR_MESSAGES.AUTH.SIGN_IN_TIMEOUT_DESCRIPTION,
			});
		}

		// Password doesn't match - return generic error for security
		if (!isPasswordMatch) {
			throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
		}

		// Generate JWT token - handle JWT errors
		try {
			const accessToken = await this.jwtService.signAsync(
				{
					sub: user.id,
					email: user.email,
				},
				{
					expiresIn: this.jwtConfiguration.expiresIn,
					audience: this.jwtConfiguration.audience,
					issuer: this.jwtConfiguration.issuer,
					secret: this.jwtConfiguration.secret,
				},
			);

			return {
				accessToken,
			};
		} catch (error) {
			// JWT generation error - infrastructure issue
			throw new RequestTimeoutException(ERROR_MESSAGES.AUTH.SIGN_IN_TIMEOUT, {
				description: ERROR_MESSAGES.AUTH.SIGN_IN_TIMEOUT_DESCRIPTION,
			});
		}
	}
}
