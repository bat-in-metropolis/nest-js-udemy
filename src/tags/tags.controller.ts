import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CreateTagDto } from "./dtos/create-tag.dto";
import { TagsService } from "./providers/tags.service";
import { DeleteTagByIdDto } from "./dtos/delete-tag.dto";

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

	/**
	 * Delete Tag
	 */
	@Delete("/:id")
	public async deleteTag(@Param() deleteTagByIdDto: DeleteTagByIdDto) {
		return await this.tagsService.delete(deleteTagByIdDto.id);
	}

	/**
	 * Soft Delete Tag
	 */
	@Delete("soft-delete/:id")
	public async softDeleteTag(@Param() deleteTagByIdDto: DeleteTagByIdDto) {
		return await this.tagsService.softRemove(deleteTagByIdDto.id);
	}
}
