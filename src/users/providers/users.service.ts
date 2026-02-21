import {
	BadRequestException,
	forwardRef,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	RequestTimeoutException,
} from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";
import { ERROR_MESSAGES } from "src/common/constants/error-messages.constants";
import { DataSource, Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";

/**
 * Class to connect to Users table and perform buisness operations
 */
@Injectable()
export class UsersService {
	constructor(
		/**
		 * Auth service used for authentication checks
		 */
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,

		/**
		 * User repository used for database operations
		 */
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		/**
		 * Injecting ConfigService
		 */
		private readonly configService: ConfigService,

		/**
		 * Inject usersCreateManyProvider
		 */
		private readonly usersCreateManyProvider: UsersCreateManyProvider,
	) {}

	/**
	 * The method to get all the users from the database
	 * @param limit The number of users to return
	 * @param page The page number
	 * @returns The users and pagination information
	 */
	public findAll(limit: number, page: number) {
		throw new HttpException(
			{
				status: HttpStatus.MOVED_PERMANENTLY,
				error: "The API endpoint does not exist",
				fileName: "user.service.ts",
				lineNumber: 54,
			},
			HttpStatus.MOVED_PERMANENTLY,
			{
				description: "Occurred because the API endpoint was permanently moved",
				cause: new Error(),
			},
		);
	}

	/**
	 * The method to get a single user by ID
	 * @param id The user ID
	 * @returns The user
	 */
	public async findOneById(id: number): Promise<User | null> {
		let user: User | null = null;
		try {
			user = await this.userRepository.findOneBy({ id });
		} catch (error) {
			throw new RequestTimeoutException(
				ERROR_MESSAGES.DATABASE.CONNECTION_TIMEOUT,
				{ description: ERROR_MESSAGES.DATABASE.CONNECTION_TIMEOUT_DESCRIPTION },
			);
		}

		/**
		 * User doesn't exist exception.
		 */
		if (!user) {
			throw new BadRequestException(ERROR_MESSAGES.USER.USER_DOES_NOT_EXIST);
		}

		return user;
	}

	/**
	 * The method to create a new user
	 * @param createUserDto The user data to create
	 * @returns The created user
	 */
	public async createUser(createUserDto: CreateUserDto): Promise<User> {
		/**
		 * 1. Check if user already exists
		 * 2. if yes - Handle exception
		 * 3. if no - Create user
		 */

		/**
			let existingUser: User | null = null;
			try {
				// Check if user already exists
				existingUser = await this.userRepository.findOne({
					where: {
						email: createUserDto.email,
					},
				});
			} catch (error: unknown) {
				// Might save the details of the exception.
				// Because we will prefer not to send sensitive details to the user.
				throw new RequestTimeoutException(
					ERROR_MESSAGES.DATABASE.CONNECTION_TIMEOUT,
					{ description: ERROR_MESSAGES.DATABASE.CONNECTION_TIMEOUT_DESCRIPTION },
				);
			}

			// if yes - Handle exception
			if (existingUser) {
				throw new BadRequestException(ERROR_MESSAGES.USER.ALREADY_EXISTS);
			}

			// if no - Create user
			let user = this.userRepository.create(createUserDto);

			try {
				user = await this.userRepository.save(user);
			} catch (error) {
				throw new RequestTimeoutException(
					ERROR_MESSAGES.DATABASE.CONNECTION_TIMEOUT,
					{ description: ERROR_MESSAGES.DATABASE.CONNECTION_TIMEOUT_DESCRIPTION },
				);
			}
			return user;
		 */

		/**
		 * A more clean way.
		 * Has more DB error reliance.
		 *
		 * Things to introduce later on -
		 * 1. Return DTO instead of entity
		 * 2. Logging
		 */
		const user = this.userRepository.create(createUserDto);

		try {
			return await this.userRepository.save(user);
		} catch (error: any) {
			// Postgres unique violation
			if (error.code === "23505") {
				throw new BadRequestException(ERROR_MESSAGES.USER.ALREADY_EXISTS);
			}

			throw new RequestTimeoutException(
				ERROR_MESSAGES.DATABASE.CONNECTION_TIMEOUT,
			);
		}
	}

	public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
		return await this.usersCreateManyProvider.createManyUsers(
			createManyUsersDto,
		);
	}
}
