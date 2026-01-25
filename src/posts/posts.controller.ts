import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";

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
	public getPosts(@Param("userId") userId: number) {
		console.log("post controller", { userId });
		return this.postsService.findAll(userId);
	}

	@Post()
	public createPost(@Body() createPostDto: CreatePostDto) {
		return createPostDto;
	}
}
