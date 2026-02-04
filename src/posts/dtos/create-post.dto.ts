import { Type } from "class-transformer";
import {
	IsArray,
	IsEnum,
	IsISO8601,
	IsJSON,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Matches,
	MaxLength,
	MinLength,
	ValidateNested,
} from "class-validator";
import { PostType } from "../enums/postType.enum";
import { Status } from "../enums/postStatus.enums";
import { CreatePostMetaOptionsDto } from "./create-post-meta-options.dtos";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
	@ApiProperty({
		example: "Sample Post",
		description: "Title of the blog post",
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(512)
	title: string;

	@ApiProperty({
		enum: PostType,
		example: PostType.POST,
		description:
			"Type of the blog post, Possible values - 'post', 'page', 'story', 'series'",
	})
	@IsNotEmpty()
	@IsEnum(PostType)
	postType: PostType;

	@ApiProperty({
		example: "sample-slug",
		description:
			"A slug can contain only lowercase letters, numbers, and hyphens. e.g. my-blog-post-slug",
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message:
			"A slug can contain only lowercase letters, numbers, and hyphens. e.g. my-blog-post-slug",
	})
	@MaxLength(256)
	slug: string;

	@ApiProperty({
		enum: Status,
		example: Status.PUBLISHED,
		description:
			"Status of the blog post, Possible values - 'draft', 'published', 'scheduled', 'review'",
	})
	@IsString()
	@IsEnum(Status)
	status: Status;

	@ApiPropertyOptional({
		example: "Sample Content",
		description: "Content of the blog post",
	})
	@IsOptional()
	@IsString()
	@MinLength(10)
	content?: string;

	@ApiPropertyOptional({
		example:
			'{\r\n"@context": "https://schema.org",\r\n"@type": "BlogPosting"\r\n}',
		description:
			"Schema of the blog post. Serialized your JSON object else a validation error will be thrown",
	})
	@IsOptional()
	@IsJSON()
	schema?: string;

	@ApiPropertyOptional({
		example: "https://example.com/image.jpg",
		description: "Featured image URL of the blog post",
	})
	@IsOptional()
	@IsUrl()
	@MaxLength(1024)
	featuredImageUrl?: string;

	@ApiPropertyOptional({
		example: "2026-01-25T09:17:41.000Z",
		description: "Publish date of the blog post",
	})
	@IsOptional()
	@IsISO8601()
	publishOn: Date;

	@ApiPropertyOptional({
		example: ["tag1", "tag2"],
		description: "Tags of the blog post",
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@MinLength(3, { each: true })
	tags?: string[];

	@ApiPropertyOptional({
		type: "array",
		required: false,
		items: {
			type: "object",
			properties: {
				key: {
					type: "string",
					description:
						"The key can be any string identifier for your meta option",
					example: "sidebarEnabled",
				},
				value: {
					type: "any",
					description: "Any value that you want to store to the key(}",
					example: "true",
				},
			},
		},
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePostMetaOptionsDto)
	metaOptions: CreatePostMetaOptionsDto[];
}
