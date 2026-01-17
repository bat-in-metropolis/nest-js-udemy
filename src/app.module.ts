import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

/**
 * User Created Module
 */

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
