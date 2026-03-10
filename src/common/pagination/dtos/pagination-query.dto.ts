import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
	@IsInt()
	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	limit: number = 10;

	@IsInt()
	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	page: number = 1;
}
