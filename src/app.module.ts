import { CommandModule } from "./command/command.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordModule } from "./discord/discord.module";
import { DatabaseModule } from "./database/database.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        CommandModule,
        DiscordModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
