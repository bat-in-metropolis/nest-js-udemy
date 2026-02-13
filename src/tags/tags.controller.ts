import { Body, Controller, Post } from "@nestjs/common";
import { CreateTagDto } from "./dtos/create-tag.dto";
import { TagsService } from "./providers/tags.service";

@Controller("tags")
export class TagsController {
	constructor(
		/**
		 * Injecting TagsService
		 */
		private readonly tagsService: TagsService,
	) {}
	/**
	 * createTag
	 */
	@Post()
	public createTag(@Body() createTagDto: CreateTagDto) {
		return this.tagsService.create(createTagDto);
	}
}
