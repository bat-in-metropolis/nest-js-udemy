import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsJSON,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";

export class CreateTagDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(256)
	name: string;

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

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsJSON()
	schema?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsUrl()
	@MaxLength(1024)
	featuredImageUrl?: string;
}
