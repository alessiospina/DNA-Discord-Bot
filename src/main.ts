/* eslint-disable prettier/prettier */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import flash = require('connect-flash');
import * as session from 'express-session';
import * as passport from "passport";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', '/client/public'))
    app.setBaseViewsDir(join(__dirname, '..', '/client/views'))
    app.setViewEngine('hbs')

    app.use(
        session({
          secret: 'nest cats',
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
