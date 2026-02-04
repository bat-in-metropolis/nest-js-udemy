import { CreatePostMetaOptionsDto } from "./dtos/create-post-meta-options.dtos";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PostType } from "./enums/postType.enum";
import { Status } from "./enums/postStatus.enums";

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

  // Will work in these later on
  tags?: string[];

  metaOptions?: CreatePostMetaOptionsDto[];
}
