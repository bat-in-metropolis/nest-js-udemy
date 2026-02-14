import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteTagByIdDto {
	@ApiProperty({
		description: "Delete Tag with specific id",
		example: 1,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	id: number;
}
