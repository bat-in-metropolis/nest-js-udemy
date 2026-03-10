import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PatchPostDto } from "./dtos/patch-post.dtos";
import { GetPostDto } from "./dtos/get-posts.dto";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
	constructor(
		/**
		 * Injecting PostsService
		 */
		private readonly postsService: PostsService,
	) {}

	@Get()
	public getAllPosts(@Query() query: GetPostDto) {
		return this.postsService.findAll(query);
	}

	/**
	 * GET localhost:3000/posts/:userId
	 */
	@Get("{/:userId}")
	public getPosts(@Param("userId") userId: number) {
		return this.postsService.findOneById(userId);
	}

	@ApiOperation({
		summary: "Creates a new blog post",
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "You get a 201 response if your post is created successfully",
	})
	@Post()
	public createPost(@Body() createPostDto: CreatePostDto) {
		return this.postsService.create(createPostDto);
	}

	@ApiOperation({
		summary: "Updating an existing blog post",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "You get a 200 response if your post is updated successfully",
	})
	@Patch()
	public updatePost(@Body() updatePostDto: PatchPostDto) {
		return this.postsService.update(updatePostDto);
	}

	@Delete("/:postId")
	public deletePost(@Param("postId", ParseIntPipe) postId: number) {
		return this.postsService.delete(Number(postId));
	}
}
