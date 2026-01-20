import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
	@Get("{/:id}")
	public getUsers(
		@Param("id", ParseIntPipe) id: number | undefined,
		@Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
	) {
		console.log({
			id,
			limit,
			page,
			typeOfID: typeof id,
			typeOfLimit: typeof limit,
			typeOfPage: typeof page,
		});
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
