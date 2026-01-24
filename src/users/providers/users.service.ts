import { Injectable } from "@nestjs/common";
import { GetUsersParamsDto } from "../dtos/get-users-params.dto";

@Injectable()
export class UsersService {
	public findAll(
		getUsersParamsDto: GetUsersParamsDto,
		limit: number,
		page: number,
	) {
		return [
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
		];
	}

	/**
	 * Find a user by ID
	 */
	public findOneById(id: string) {
		return {
			id: 1234,
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
		};
	}
}
