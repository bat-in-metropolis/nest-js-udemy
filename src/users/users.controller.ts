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
	Req,
} from "@nestjs/common";
// import type { Request } from "express";

@Controller("users")
export class UsersController {
	/**
	 * @Get("{/:id}") - here params are optional
	 * @Get("/:id") - here params are not optional
	 */
	/**
	 * ROUTE PARAMS & OPTIONAL PARAMS IN NESTJS (v11)
	 * ---------------------------------------------
	 *
	 * 1️⃣ Mandatory route param (official & supported)
	 * ------------------------------------------------
	 * @Get(':id')
	 * Example:
	 *   GET /users/123
	 *   → @Param('id') === '123'
	 *
	 *
	 * 2️⃣ Optional route params using `?` ❌ (NOT supported)
	 * ------------------------------------------------------
	 * @Get(':id/:optional?')
	 *
	 * This syntax is NOT supported in NestJS v11.
	 * NestJS uses `path-to-regexp@6`, which does not allow
	 * optional route params using `?`.
	 * This will throw a runtime error.
	 *
	 *
	 * 3️⃣ Optional route params using regex group ⚠️ (WORKS but NOT official)
	 * ----------------------------------------------------------------------
	 * @Get('/:id{/:optional}')
	 *
	 * This works because it leverages `path-to-regexp` regex grouping.
	 *
	 * Examples:
	 *   GET /users/asdf
	 *     → id = 'asdf'
	 *     → optional = undefined
	 *
	 *   GET /users/asdf/1234
	 *     → id = 'asdf'
	 *     → optional = '1234'
	 *
	 * ⚠️ Important:
	 * - This behavior is undocumented in NestJS
	 * - Swagger/OpenAPI does NOT understand this properly
	 * - Future NestJS versions may break this
	 * - Not recommended for production code
	 *
	 *
	 * 4️⃣ RECOMMENDED way to handle optional data ✅
	 * ---------------------------------------------
	 * Use QUERY PARAMETERS instead of optional route params.
	 *
	 * Example:
	 *   GET /users/123?optional=456&limit=10&offset=0
	 *
	 * This is:
	 * - Officially supported
	 * - Idiomatic NestJS
	 * - Swagger-friendly
	 * - Safer for future upgrades
	 *
	 *
	 * 5️⃣ Alternative (safe but verbose)
	 * ----------------------------------
	 * Define two routes explicitly:
	 *
	 *   @Get(':id')
	 *   @Get(':id/:optional')
	 *
	 * This is fully supported but increases duplication.
	 */

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

	/**
	 * REQUEST BODY HANDLING IN NESTJS
	 * ------------------------------
	 *
	 * 1️⃣ @Body() ✅ (RECOMMENDED — MOST COMMON CASE)
	 * ----------------------------------------------
	 * Use `@Body()` when:
	 * - You only need the request payload (JSON body)
	 * - You want clean, readable, and testable controllers
	 * - You plan to use DTOs and validation pipes
	 *
	 * Example:
	 *   POST /users
	 *   Body: { "name": "John", "email": "john@example.com" }
	 *
	 *   createUser(@Body() body: CreateUserDto)
	 *
	 * Why this is preferred:
	 * - Keeps controllers framework-agnostic
	 * - Works seamlessly with validation & transformation
	 * - Encourages DTO-driven design
	 * - Easier to mock in unit tests
	 *
	 *
	 * 2️⃣ @Req() ⚠️ (LOW-LEVEL — USE SPARINGLY)
	 * -----------------------------------------
	 * Use `@Req()` when:
	 * - You need access to the full request object
	 * - You need headers, cookies, IP, or raw request data
	 * - You are integrating with legacy Express middleware
	 *
	 * Example use cases:
	 * - Reading Authorization headers manually
	 * - Accessing cookies or session data
	 * - Getting client IP or user-agent
	 *
	 * Example:
	 *   createUser(@Req() req: Request)
	 *   const body = req.body;
	 *
	 * Downsides of @Req():
	 * - Tightly couples controller to Express/Fastify
	 * - Harder to test
	 * - Bypasses NestJS abstractions
	 * - Discourages DTO + validation usage
	 *
	 *
	 * 3️⃣ ❌ What NOT to do
	 * -------------------
	 * - Do NOT use @Req() just to access req.body
	 * - Do NOT mix @Req() and @Body() for the same data
	 * - Do NOT use @Req() by default out of habit
	 *
	 *
	 * 4️⃣ Rule of Thumb 🧠
	 * -------------------
	 * - If you only need request data → use @Body(), @Param(), @Query()
	 * - If you need protocol-level details → use @Req()
	 */

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
