import { Injectable } from "@nestjs/common";

@Injectable()
export class PostsService {
	findAll(userId: string) {
		console.log("post service", { userId });
		return "This action returns all posts";
	}
}
