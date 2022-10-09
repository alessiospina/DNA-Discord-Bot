import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordManager } from "./discord.manager";
import { CommandModule } from "../command/command.module";

@Module({
    imports: [ConfigModule, CommandModule],
    providers: [DiscordManager],
    exports: [DiscordManager],
})
export class DiscordModule {}
