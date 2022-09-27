/* eslint-disable prettier/prettier */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', '/client/public'))
    app.setBaseViewsDir(join(__dirname, '..', '/client/views'))
    app.setViewEngine('hbs')
    
    await app.listen(3000);
}
bootstrap();
