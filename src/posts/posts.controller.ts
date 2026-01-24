import { Controller } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";

@Controller("posts")
export class PostsController {
	constructor(
		/**
		 * Injecting PostsService
		 */
		private readonly postsService: PostsService,
	) {}
}
