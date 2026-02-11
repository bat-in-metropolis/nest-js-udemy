import { Body, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Repository } from "typeorm";
import { Post } from "../post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";

@Injectable()
export class PostsService {
	constructor(
		/**
		 * Injecting UsersService
		 */
		private readonly usersService: UsersService,

		/**
		 * Injecting postsRepository
		 */
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,

		/**
		 * Injecting MetaOptionRepository
		 */
		@InjectRepository(MetaOption)
		private readonly metaOptionRepository: Repository<MetaOption>,
	) {}

	public async findAll() {
		/**
		 * To fetch metaOptions as well from database.
		 * const posts = this.postRepository.find({
		 *    relations: {
		 *      metaOptions: true
		 *    }
		 * });
		 * Or in Post entity in metaOptions we can set "eager: true" as well.
		 */
		const posts = this.postRepository.find();

		return posts;
	}

	/**
	 * Creating new posts
	 */
	public async create(@Body() createPostDto: CreatePostDto) {
		/**
      // Create metaOptions
      const metaOptions = createPostDto.metaOptions
        ? this.metaOptionRepository.create(createPostDto.metaOptions)
        : null;

      if (metaOptions) await this.metaOptionRepository.save(metaOptions);

      // Create post (omit metaOptions — DTO type is incompatible with entity; we assign it below)
      const { metaOptions: _dtoMeta, ...postData } = createPostDto;
      const post = this.postRepository.create(postData);

      // If metaOptions exists — add metaOptions to the post
      if (metaOptions) post.metaOptions = metaOptions;

      // return the post
      return await this.postRepository.save(post);
     */

		/**
		 * With use of Cascade -
		 */

		// Default way -
		// const post = this.postRepository.create(createPostDto);

		// Transform DTO to match entity structure
		// Handle null metaOptions by converting to undefined or omitting it

		const { metaOptions, ...postData } = createPostDto;
		const postDataForCreate = {
			...postData,
			...(metaOptions !== null
				? { metaOptions: metaOptions as Partial<MetaOption> }
				: null),
		};

		const post = this.postRepository.create(postDataForCreate);

		return await this.postRepository.save(post);
	}

	public async delete(postId: number) {
		/**
		 * Steps -
		 * Find the post by ID
		 * take out id for metaOptions if they exists.
		 * delete post
		 * delete metaOptions
		 * return confirmation
		 *
		 * ---------------------------------------------
		 * console.log("manas delete postId: ", postId);
		 * const post = await this.postRepository.findOneBy({
		 * 	id: postId,
		 * });
		 * const metaOptionId = post?.metaOptions?.id;
		 * console.log({ metaOptionId });
		 * if (post) await this.postRepository.delete(postId);
		 * if (metaOptionId) await this.metaOptionRepository.delete(metaOptionId);
		 */

		/**
		 * Deleting by using two directional relationship.
		 * if (metaOptionId) {
		 * 	const inversePost = await this.metaOptionRepository.find({
		 * 		where: {
		 * 			id: metaOptionId,
		 * 		},
		 * 		relations:{
		 * 			post: true
		 * 		}
		 * 	});
		 * 	return { deleted: true, id: postId, inversePost };
		 * }
		 */

		await this.postRepository.delete(postId);

		return { deleted: true, id: postId };
	}
}
