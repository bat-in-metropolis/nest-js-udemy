import { IntersectionType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";

class GetPostsBaseDto {
	@IsOptional()
	@IsDate()
	@Type(() => Date)
	startDate?: Date;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	endDate?: Date;
}

export class GetPostDto extends IntersectionType(
	GetPostsBaseDto,
	PaginationQueryDto,
) {}
