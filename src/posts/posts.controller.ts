import { Controller, Get, Param } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { ApiTags } from "@nestjs/swagger";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
	constructor(
		/**
		 * Injecting PostsService
		 */
		private readonly postsService: PostsService,
	) {}

	/**
	 * GET localhost:3000/posts/:userId
	 */
	@Get("{/:userId}")
	public getPosts(@Param("userId") userId: string) {
		console.log("post controller", { userId });
		return this.postsService.findAll(userId);
	}
}
