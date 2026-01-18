import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
	@Get("/:id{/:optional}")
	public getUsers(
		@Param("id") id: string,
		@Param("optional") optional?: string,
		@Query("limit") limit?: number,
		@Query("offset") offset?: number,
	) {
		console.log({ id, optional, limit, offset });
		return "You sent a get request to /users endpoint";
	}

	@Post()
	public createUser(@Body() requestBody: any) {
		console.log(requestBody);
		return "You sent a post request to /users endpoint";
	}

	@Patch()
	public updateUser() {
		return "You sent a patch request to /users endpoint";
	}

	@Put()
	public replaceUser() {
		return "You sent a put request to /users endpoint";
	}

	@Delete()
	public deleteUser() {
		return "You sent a delete request to /users endpoint";
	}
}
