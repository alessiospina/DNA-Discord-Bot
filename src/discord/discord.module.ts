import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordManager } from "./discord.manager";
import { DnaBotModule } from "../dnabot/dnabot.module";

@Module({
    imports: [ConfigModule, DnaBotModule],
    providers: [DiscordManager],
})
export class DiscordModule {}
