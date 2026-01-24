import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetUserByIdDto {
	@ApiProperty({
		description: "Get user with specific id",
		example: 1234,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	id: number;
}
