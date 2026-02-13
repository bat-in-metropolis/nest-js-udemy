import { Injectable } from "@nestjs/common";
import { CreateTagDto } from "../dtos/create-tag.dto";
import { Repository } from "typeorm";
import { Tag } from "../tag.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TagsService {
	constructor(
		/**
		 * Tag repository used for database operations
		 */
		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,
	) {}
	public async create(createTagDto: CreateTagDto) {
		/**
		 * 1. Check if tag already exists
		 * 2. if yes - Handle exception
		 * 3. if no - Create user
		 */

		const existingTag = await this.tagRepository.findOne({
			where: {
				slug: createTagDto.slug,
			},
		});

		if (existingTag) {
			throw new Error("Tag already exists");
		}

		const tag = this.tagRepository.create(createTagDto);
		return await this.tagRepository.save(tag);
	}
}
