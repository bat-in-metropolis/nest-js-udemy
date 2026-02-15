import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PostsModule } from "./posts/posts.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./users/user.entity";
import { TagsModule } from "./tags/tags.module";
import { MetaOptionsModule } from "./meta-options/meta-options.module";

const ENV = process.env.NODE_ENV;
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			// envFilePath: [".env.dev"],
			envFilePath: !ENV ? ".env" : `.env.${ENV}`,
		}),
		UsersModule,
		PostsModule,
		AuthModule,
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				// entities: [User],
				autoLoadEntities: true,
				synchronize: ENV === "dev", // never push this to production, can cause data loss
				host: configService.get("DB_HOST"),
				port: Number(configService.get("DB_PORT")),
				username: configService.get("DB_USER"),
				password: configService.get("DB_PASSWORD"),
				database: configService.get("DB_NAME"),
			}),
		}),
		TagsModule,
		MetaOptionsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
