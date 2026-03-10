import { Inject, Injectable } from "@nestjs/common";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";
import { ObjectLiteral, Repository } from "typeorm";
import { Paginated } from "../interface/paginated.interface";
import type { Request } from "express";
import { REQUEST } from "@nestjs/core";
// import { Request } from "@nestjs/common";

@Injectable()
export class PaginationProvider {
	constructor(
		/**
		 * Injecting Request
		 */
		@Inject(REQUEST)
		private readonly request: Request,
	) {}
	public async paginateQuery<T extends ObjectLiteral>(
		paginationQuery: PaginationQueryDto,
		repository: Repository<T>,
	): Promise<Paginated<T>> {
		const limit = paginationQuery.limit || 10;
		const page = paginationQuery.page || 1;

		const [data, totalItems] = await repository.findAndCount({
			skip: (page - 1) * limit,
			take: limit,
		});

		const totalPages = Math.ceil(totalItems / limit);

		const baseUrl = `${this.request.protocol}://${this.request.get("host")}${this.request.path}`;

		return {
			data,
			meta: {
				totalItems,
				itemsPerPage: limit,
				totalPages,
				currentPage: page,
			},
			links: {
				first: `${baseUrl}?limit=${limit}&page=1`,
				previous:
					page > 1
						? `${baseUrl}?limit=${limit}&page=${page - 1}`
						: `${baseUrl}?limit=${limit}&page=1`,
				current: `${baseUrl}?limit=${limit}&page=${page}`,
				next:
					page < totalPages
						? `${baseUrl}?limit=${limit}&page=${page + 1}`
						: `${baseUrl}?limit=${limit}&page=${totalPages || 1}`,
				last: `${baseUrl}?limit=${limit}&page=${totalPages || 1}`,
			},
		};
	}
}
