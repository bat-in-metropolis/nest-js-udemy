import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FindOneUserByEmailProvider {
	constructor(
		/**
		 * Injecting UsersRepository
		 */
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	public async findOneByEmail(email: string): Promise<User | null> {
		return await this.usersRepository.findOne({ where: { email } });
	}
}
