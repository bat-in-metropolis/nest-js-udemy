import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";

@Injectable()
export class PostsService {
	constructor(
		/**
		 * Injecting UsersService
		 */
		private readonly usersService: UsersService,
	) {}

	findAll(userId: string) {
		// User Service
		// Find a user with the provided userId
		const user = this.usersService.findOneById(userId);

		return [
			{
				id: 1,
				title: "Post 1",
				content: "Content 1",
				user,
			},
			{ id: 2, title: "Post 2", content: "Content 2", user },
		];
	}
}
