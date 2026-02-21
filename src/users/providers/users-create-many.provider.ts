import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-user.dto";
import { DataSource } from "typeorm";
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
		/**
		 * Steps
		 * 1. Create Query Runner Instance
		 * 2. Connect Query Runner to Database
		 * 3. Start Transaction
		 * 4. If successful - commit
		 * 5. If unsuccessful - rollback
		 * 6. Release connection
		 */

		const newUsers: User[] = [];
		// Create Query Runner Instance
		const queryRunner = this.dataSource.createQueryRunner();

		// Connect Query Runner to Database
		await queryRunner.connect();

		// Start Transaction
		await queryRunner.startTransaction();

		try {
			for (const user of createManyUsersDto.users) {
				const newUser = queryRunner.manager.create(User, user);
				const result = await queryRunner.manager.save(newUser);
				newUsers.push(result);
			}
			//If successful - commit
			await queryRunner.commitTransaction();
		} catch (error: unknown) {
			// If unsuccessful - rollback
			await queryRunner.rollbackTransaction();
		} finally {
			// Release connection
			await queryRunner.release();
		}

		return newUsers;
	}
}
