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
}
