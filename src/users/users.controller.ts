import { Controller, Get, Post, Patch, Put, Delete } from "@nestjs/common";

@Controller("users")
export class UsersController {
	@Get()
	public getUsers() {
		return "You sent a get request to /users endpoint";
	}

	@Post()
	public createUser() {
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
