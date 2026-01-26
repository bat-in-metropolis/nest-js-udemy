import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	/**
	 * Global validation pipe
	 * - whitelist: strips unknown properties
	 * - forbidNonWhitelisted: throws error if extra fields are sent
	 * - transform: auto-transform payloads to DTO types
	 */
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	/**
	 * Read env variables
	 * process.env is already populated by @nestjs/config
	 */
	const port = process.env.PORT ? Number(process.env.PORT) : 3000;
	const appUrl = process.env.APP_URL ?? `http://localhost:${port}`;

	if (!process.env.PORT) {
		console.warn("⚠️ PORT not set, defaulting to 3000");
	}

	/**
	 * swagger configuration
	 */
	const config = new DocumentBuilder()
		.setTitle("NestJS - Blog app API")
		.setDescription(`Use the base API URL as ${appUrl}`)
		.setTermsOfService(`${appUrl}/terms-of-service`)
		.setLicense("MIT license", "https://opensource.org/licenses/MIT")
		.addServer(appUrl)
		.setVersion("1.0")
		.build();

	/**
	 * Instantiating the document
	 */
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(port);
	console.log(`🚀 Server running at ${appUrl}`);
}
bootstrap();
