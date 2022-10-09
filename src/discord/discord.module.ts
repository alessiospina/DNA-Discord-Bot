import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordManager } from "./discord.manager";
import { CommandModule } from "../command/command.module";
import { DiscordReuploadCommands } from "./discord.reupload.commands";

@Module({
    imports: [ConfigModule, CommandModule],
    providers: [DiscordManager, DiscordReuploadCommands],
    exports: [DiscordManager, DiscordReuploadCommands],
})
export class DiscordModule {}
