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

  findAll(userId: number) {
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

  /**
   * Creating new posts
   */
  public async create(@Body() createPostDto: CreatePostDto) {
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
  }
}
