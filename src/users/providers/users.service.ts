import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";

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
	) {}

	/**
	 * The method to get all the users from the database
	 * @param limit The number of users to return
	 * @param page The page number
	 * @returns The users and pagination information
	 */
	public findAll(limit: number, page: number) {
		const isAuthenticated = this.authService.isAuth();
		console.log({ isAuthenticated });
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
	public findOneById(id: number) {
		return {
			id,
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
		};
	}

	/**
	 * The method to create a new user
	 * @param createUserDto The user data to create
	 * @returns The created user
	 */
	public async createUser(createUserDto: CreateUserDto) {
		/**
		 * 1. Check if user already exists
		 * 2. if yes - Handle exception
		 * 3. if no - Create user
		 */
		// Check if user already exists
		const existingUser = await this.userRepository.findOne({
			where: {
				email: createUserDto.email,
			},
		});

		// if yes - Handle exception
		if (existingUser) {
			throw new Error("User already exists");
		}

		// if no - Create user
		const user = this.userRepository.create(createUserDto);
		return await this.userRepository.save(user);
	}
}
