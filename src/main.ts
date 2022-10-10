/* eslint-disable prettier/prettier */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import flash = require('connect-flash');
import * as session from 'express-session';
import * as passport from "passport";
import { ForbiddenExceptionFilter } from "./filter/forbidden.exception.filter";
import { NotFoundExceptionFilter } from "./filter/not.found.exception.filter";
import { UnauthorizedExceptionFilter } from "./filter/unauthorized.exception.filter";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalFilters(new ForbiddenExceptionFilter());
    app.useGlobalFilters(new NotFoundExceptionFilter());
    app.useGlobalFilters(new UnauthorizedExceptionFilter());

    app.useStaticAssets(join(__dirname, '..', '/client/public'))
    app.setBaseViewsDir(join(__dirname, '..', '/client/views'))
    
    app.setViewEngine('ejs')

    const configService: ConfigService = app.get(ConfigService);

    app.use(
        session({
          secret: configService.getOrThrow('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
        }),
      );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    
    await app.listen(3000);
}
bootstrap();
