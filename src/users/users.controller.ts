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
import { GetUserByIdDto } from "./dtos/get-user-by-id.dto";
import { PatchUserData } from "./dtos/patch-user.dtos";
import { UsersService } from "./providers/users.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("Users")
export class UsersController {
	constructor(
		// Injecting the UsersService instance
		private readonly usersService: UsersService,
	) {}

	@Get()
	@ApiOperation({ summary: "Get all users (paginated)" })
	@ApiResponse({
		status: 200,
		description: "Users fetched successfully based on the query parameters",
	})
	@ApiQuery({
		name: "limit",
		required: false,
		type: Number,
		description: "The number of entries to returned per query",
		example: 10,
	})
	@ApiQuery({
		name: "page",
		required: false,
		type: Number,
		description:
			"The position of the page number that you want the API to return",
		example: 1,
	})
	public getUsers(
		@Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
	) {
		return this.usersService.findAll(limit, page);
	}

	@Get(":id")
	@ApiOperation({
		summary: "Get user with specific id",
	})
	@ApiResponse({
		status: 200,
	})
	public getUsersWithId(@Param() getUserByIdDto: GetUserByIdDto) {
		return this.usersService.findOneById(getUserByIdDto.id);
	}

	@Post()
	public createUser(
		@Body() createUserDto: CreateUserDto,
		@Headers() headers: any,
		@Ip() ip: string,
	) {
		console.log("createUser:", {
			request: createUserDto,
			typeOfRequest: typeof createUserDto,
			headers,
			typeOfHeaders: typeof headers,
			ip,
			typeOfIp: typeof ip,
			instanceofRequest: createUserDto instanceof CreateUserDto,
		});

		return this.usersService.createUser(createUserDto);
	}

	@Patch()
	public patchUser(@Body() patchUserDto: PatchUserData) {
		console.log("patchUser:", {
			request: patchUserDto,
			typeOfRequest: typeof patchUserDto,
			instanceofRequest: patchUserDto instanceof PatchUserData,
		});
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
