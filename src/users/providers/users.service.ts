import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	RequestTimeoutException,
} from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";
import { ERROR_MESSAGES } from "src/common/constants/error-messages.constants";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigService } from "@nestjs/config";

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
	) {}

	/**
	 * The method to get all the users from the database
	 * @param limit The number of users to return
	 * @param page The page number
	 * @returns The users and pagination information
	 */
	public findAll(limit: number, page: number) {
		const isAuthenticated = this.authService.isAuth();
		const port = this.configService.get("PORT");
		console.log({ isAuthenticated, port });
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
	public async findOneById(id: number): Promise<User | null> {
		return await this.userRepository.findOneBy({ id });
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

		let existingUser: User | null = null;
		try {
			// Check if user already exists
			existingUser = await this.userRepository.findOne({
				where: {
					email: createUserDto.email,
				},
			});
} catch (error: unknown) {
      /**
       * Might save the details of the exception.
       * Because we will prefer not to send sensitive details to the user.
       */
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
		const user = this.userRepository.create(createUserDto);
		return await this.userRepository.save(user);
	}
}
