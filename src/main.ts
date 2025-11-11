import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	app.setGlobalPrefix("api");

	const config = new DocumentBuilder()
		.setTitle("Registros API")
		.setDescription("API documentation for Registros application")
		.setVersion("0.1")
		.addTag("ITS")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document, {
		useGlobalPrefix: true,
	});

	app.enableCors({
		origin: true,
		credentials: true,
	});

	await app.listen(process.env.PORT ?? 8000, "0.0.0.0").catch((err) => {
		console.error(err);
	});
}
bootstrap().catch((err) => {
	console.error("Error during bootstrap:", err);
});
