import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	RequestTimeoutException,
} from "@nestjs/common";
import { In, Repository } from "typeorm";
import { User } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ERROR_MESSAGES } from "src/common/constants/error-messages.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";

@Injectable()
export class CreateUserProvider {
	constructor(
		/**
		 * Injecting userRepository
		 */
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		/**
		 * Injecting hashingProvider
		 */
		@Inject(forwardRef(() => HashingProvider))
		private readonly hashingProvider: HashingProvider,
	) {}

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
		const { password, ...userData } = createUserDto;
		const hashedPassword = await this.hashingProvider.hashPassword(password);
		const userToCreate = { ...userData, password: hashedPassword };
		const user = this.userRepository.create(userToCreate);

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
}
