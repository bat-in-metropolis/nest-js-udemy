import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	RequestTimeoutException,
} from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";
import { DataSource, QueryFailedError } from "typeorm";
import { User } from "../user.entity";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";

@Injectable()
export class UsersCreateManyProvider {
	constructor(
		/**
		 * Inject dataSource
		 */
		private readonly dataSource: DataSource,
	) {}

	public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
		// Create Query Runner Instance
		const queryRunner = this.dataSource.createQueryRunner();
		const newUsers: User[] = [];

		// Connect Query Runner to Database
		await queryRunner.connect();

		// Start Transaction
		await queryRunner.startTransaction();

		try {
			for (const user of createManyUsersDto.users) {
				const newUser = queryRunner.manager.create(User, user);
				const savedUser = await queryRunner.manager.save(newUser);
				newUsers.push(savedUser);
			}

			//If successful - commit
			await queryRunner.commitTransaction();

			return { users: newUsers };
		} catch (error: unknown) {
			// If unsuccessful - rollback
			await queryRunner.rollbackTransaction();

			if (error instanceof QueryFailedError) {
				const driverError: any = error;

				// Postgre unique violation
				if (driverError.code === "23505") {
					throw new ConflictException("One or more users already exists.");
				}

				// Postgre foreign key violation
				if (driverError.code === "23503") {
					throw new BadRequestException("Invalid reference provided.");
				}
			}

			throw new InternalServerErrorException("Failed to create users.");
		} finally {
			try {
				// Release connection
				await queryRunner.release();
			} catch (releaseError) {
				// Ideally log this, but do NOT override original error
				// Example: this.logger.error('Failed to release query runner', releaseError);
			}
		}

		/**
		 * Alternate approach
		 	await this.dataSource.transaction(async (manager) => {
			const users = createManyUsersDto.users.map(user =>
				manager.create(User, user),
			);

			return await manager.save(users);
			});
		 */
	}
}
