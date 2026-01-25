import { Type } from "class-transformer";
import {
	IsArray,
	IsDate,
	IsEnum,
	IsISO8601,
	IsJSON,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Matches,
	MinLength,
	ValidateNested,
} from "class-validator";
import { PostType } from "../enums/postType.enum";
import { Status } from "../enums/postStatus.enums";
import { CreatePostMetaOptionsDto } from "./create-post-meta-options.dtos";

export class CreatePostDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	title: string;

	@IsNotEmpty()
	@IsEnum(PostType)
	postType: PostType;

	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message:
			"A slug can contain only lowercase letters, numbers, and hyphens. e.g. my-slug",
	})
	slug: string;

	@IsString()
	@IsEnum(Status)
	status: Status;

	@IsOptional()
	@IsString()
	@MinLength(10)
	content?: string;

	@IsOptional()
	@IsJSON()
	schema?: string;

	@IsOptional()
	@IsUrl()
	featuredImageUrl?: string;

	@IsOptional()
	@IsISO8601()
	publishOn: Date;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@MinLength(3, { each: true })
	tags?: string[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePostMetaOptionsDto)
	metaOptions: CreatePostMetaOptionsDto[];
}
