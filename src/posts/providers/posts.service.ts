import {
	Body,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Repository } from "typeorm";
import { Post } from "../post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { TagsService } from "src/tags/providers/tags.service";
import { Tag } from "src/tags/tag.entity";
import { PatchPostDto } from "../dtos/patch-post.dtos";

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

		/**
		 *  Injecting TagService
		 */
		@Inject(forwardRef(() => TagsService))
		private readonly tagsService: TagsService,
	) {}

	public async findAll() {
		/**
		 * To fetch metaOptions as well from database.
		 * const posts = this.postRepository.find({
		 *    relations: {
		 *      metaOptions: true,
		 * 		author: true,
		 * 		tags: true
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
	public async create(createPostDto: CreatePostDto) {
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

		// Find author from database based on authorId.
		const author = await this.usersService.findOneById(createPostDto.authorId);

		if (!author) {
			throw new NotFoundException(
				`User with Id ${createPostDto.authorId} not found!`,
			);
		}

		// Find Tags
		let tagsList: Tag[] = [];
		if (createPostDto.tags) {
			tagsList = await this.tagsService.findMultipleTags(createPostDto.tags);
		}

		/**
		 * With use of Cascade -
		 */

		// Default way -
		// const post = this.postRepository.create(createPostDto);

		// Transform DTO to match entity structure
		// Handle null metaOptions by converting to undefined or omitting it

		const { metaOptions, authorId, tags, ...postData } = createPostDto;
		const postDataForCreate = {
			...postData,
			...(metaOptions !== null
				? { metaOptions: metaOptions as Partial<MetaOption> }
				: {}),
			author,
			...(tagsList.length > 0 ? { tags: tagsList } : {}),
		};

		const post = this.postRepository.create(postDataForCreate);

		return await this.postRepository.save(post);
	}

	/**
	 * Deleting a post
	 */
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

	/**
	 * Updating a post
	 */
	public async update(updatePostDto: PatchPostDto) {
		/**
		 * Steps --
		 * Find the Tags
		 * Find the Post
		 * Update the properties
		 * Assign the new tags
		 * Save and return the post
		 */

		// Find the Tags
		const tags = updatePostDto?.tags
			? await this.tagsService.findMultipleTags(updatePostDto.tags)
			: null;

		// Find the Post
		const post = await this.postRepository.find({
			where: {
				id: updatePostDto.id,
			},
		});

		// Update the properties
		post[0].title = updatePostDto.title ?? post[0].title;
		post[0].postType = updatePostDto.postType ?? post[0].postType;
		post[0].slug = updatePostDto.slug ?? post[0].slug;
		post[0].status = updatePostDto.status ?? post[0].status;
		post[0].content = updatePostDto.content ?? post[0].content;
		post[0].schema = updatePostDto.schema ?? post[0].schema;
		post[0].featuredImageUrl =
			updatePostDto.featuredImageUrl ?? post[0].featuredImageUrl;
		post[0].publishOn = updatePostDto.publishOn ?? post[0].publishOn;

		// Assign the new tags
		post[0].tags = tags ? tags : post[0].tags;

		// Save and return the post
		return await this.postRepository.save(post);
	}
}
