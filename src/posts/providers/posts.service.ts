import {
	BadRequestException,
	Body,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	RequestTimeoutException,
} from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { QueryFailedError, Repository } from "typeorm";
import { Post } from "../post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "src/meta-options/meta-option.entity";
import { TagsService } from "src/tags/providers/tags.service";
import { Tag } from "src/tags/tag.entity";
import { PatchPostDto } from "../dtos/patch-post.dtos";
import { GetPostDto } from "../dtos/get-posts.dto";
import { PaginationProvider } from "src/common/pagination/provider/pagination.provider";
import { Paginated } from "src/common/pagination/interface/paginated.interface";

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

		/**
		 * Injecting PaginationProvider
		 */
		@Inject(PaginationProvider)
		private readonly paginationProvider: PaginationProvider,
	) {}

	public async findAll(query: GetPostDto): Promise<Paginated<Post>> {
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
		const posts = await this.paginationProvider.paginateQuery(
			{
				limit: query.limit,
				page: query.page,
			},
			this.postRepository,
		);

		return posts;
	}

	public findOneById(postId: number) {
		return this.postRepository.findOne({
			where: { id: postId },
			//   relations: ["metaOptions", "author", "tags"],
		});
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
		// 1️⃣ Find Post
		const post = await this.postRepository.findOne({
			where: { id: updatePostDto.id },
			relations: ["tags"],
		});

		if (!post) {
			throw new NotFoundException(
				`Post with id ${updatePostDto.id} not found.`,
			);
		}

		// 2️⃣ Validate & Fetch Tags
		if (updatePostDto?.tags) {
			const tags = await this.tagsService.findMultipleTags(updatePostDto.tags);

			console.log("manas update : ", { tags, uPDT: updatePostDto.tags });

			if (!tags || tags.length !== updatePostDto.tags.length) {
				throw new NotFoundException(
					"One or more provided tag IDs do not exist.",
				);
			}

			post.tags = tags;
		}

		// 3️⃣ Update Only Defined Fields
		if (updatePostDto.title !== undefined) post.title = updatePostDto.title;

		if (updatePostDto.postType !== undefined)
			post.postType = updatePostDto.postType;

		if (updatePostDto.slug !== undefined) post.slug = updatePostDto.slug;

		if (updatePostDto.status !== undefined) post.status = updatePostDto.status;

		if (updatePostDto.content !== undefined)
			post.content = updatePostDto.content;

		if (updatePostDto.schema !== undefined) post.schema = updatePostDto.schema;

		if (updatePostDto.featuredImageUrl !== undefined)
			post.featuredImageUrl = updatePostDto.featuredImageUrl;

		if (updatePostDto.publishOn !== undefined)
			post.publishOn = updatePostDto.publishOn;

		// 4️⃣ Save & Handle Unique Constraint
		try {
			return await this.postRepository.save(post);
		} catch (error) {
			if (error instanceof QueryFailedError) {
				const dbError = error as any;

				// Postgres unique violation
				if (dbError.code === "23505") {
					throw new ConflictException("A post with this slug already exists");
				}
			}

			throw error;
		}
	}
}
