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
import { CreateUserProvider } from "./create-user.provider";
import { FindOneUserByEmailProvider } from "./find-one-user-by-email.provider";

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

		/**
		 * Inject createUserProvider
		 */
		private readonly createUserProvider: CreateUserProvider,

		/**
		 * Injecting findOneUserByEmailProvider
		 */
		private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
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

	public async createUser(createUserDto: CreateUserDto): Promise<User> {
		return await this.createUserProvider.createUser(createUserDto);
	}

	public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
		return await this.usersCreateManyProvider.createManyUsers(
			createManyUsersDto,
		);
	}

	public async findOneByEmail(email: string): Promise<User | null> {
		return await this.findOneUserByEmailProvider.findOneByEmail(email);
	}
}
