import { CreatePostMetaOptionsDto } from "src/meta-options/dtos/create-post-meta-options.dtos";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostType } from "./enums/postType.enum";
import { Status } from "./enums/postStatus.enums";
import { MetaOption } from "src/meta-options/meta-option.entity";

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	/**
	 * varchar - data type is used to store variable-length character strings with an optional maximum length limit
	 */
	@Column({ type: "varchar", length: 512, nullable: false })
	title: string;

	@Column({
		type: "enum",
		enum: PostType,
		nullable: false,
		default: PostType.POST,
	})
	postType: PostType;

	@Column({
		type: "varchar",
		length: 256,
		nullable: false,
		unique: true,
	})
	slug: string;

	@Column({
		type: "enum",
		enum: Status,
		nullable: false,
		default: Status.DRAFT,
	})
	status: Status;

	@Column({
		type: "text",
		nullable: true,
	})
	content?: string;

	@Column({
		type: "text",
		nullable: true,
	})
	schema?: string;

	@Column({
		type: "varchar",
		length: 1024,
		nullable: true,
	})
	featuredImageUrl?: string;

	@Column({
		type: "timestamp", // 'datetime' in MySQL
		nullable: true,
	})
	publishOn?: Date;

	@OneToOne(() => MetaOption)
	@JoinColumn()
	metaOptions?: MetaOption;

	// Will work in these later on
	tags?: string[];

}
