import { AuthModule } from "./auth/auth.module";
import { CommandModule } from "./command/command.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordModule } from "./discord/discord.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { AppController } from "./app.controller";

@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot(),
        DatabaseModule,
        CommandModule,
        DiscordModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
