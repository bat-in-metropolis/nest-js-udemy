import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PostsModule } from "./posts/posts.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/user.entity";
import { TagsModule } from "./tags/tags.module";
import { MetaOptionsModule } from "./meta-options/meta-options.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		UsersModule,
		PostsModule,
		AuthModule,
		TypeOrmModule.forRootAsync({
			imports: [],
			inject: [],
			useFactory: () => ({
				type: "postgres",
				// entities: [User],
				autoLoadEntities: true,
				synchronize: true, // never push this to production, can cause data loss
				host: process.env.DB_HOST,
				port: Number(process.env.DB_PORT),
				username: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
			}),
		}),
		TagsModule,
		MetaOptionsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
