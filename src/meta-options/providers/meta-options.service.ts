import { Injectable } from "@nestjs/common";
import { CreatePostMetaOptionsDto } from "../dtos/create-post-meta-options.dtos";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "../meta-option.entity";
import { Repository } from "typeorm";

@Injectable()
export class MetaOptionsService {
  constructor(
    /**
     * Inject metaOtionsRepository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    const metaOption = this.metaOptionRepository.create(
      createPostMetaOptionsDto,
    );

    return await this.metaOptionRepository.save(metaOption);
  }
}
