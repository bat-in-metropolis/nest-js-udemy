import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	Headers,
	Ip,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";

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
	public createUser(
		@Body() createUserDto: CreateUserDto,
		@Headers() headers: any,
		@Ip() ip: string,
	) {
		console.log("createUser:", {
			request: createUserDto,
			headers,
			ip,
		});

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
