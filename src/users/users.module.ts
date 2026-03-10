import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./providers/users.service";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersCreateManyProvider } from "./providers/users-create-many.provider";
import { CreateUserProvider } from "./providers/create-user.provider";

@Module({
	controllers: [UsersController],
	providers: [UsersService, UsersCreateManyProvider, CreateUserProvider],
	exports: [UsersService],
	imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
