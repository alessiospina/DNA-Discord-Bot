import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordManager } from "./discord.manager";
import { CommandModule } from "../command/command.module";
import { DiscordAddCommandsInterceptor } from "./interceptor/discord.add.commands.interceptor";
import { DiscordDeleteCommandsInterceptor } from "./interceptor/discord.delete.commands.interceptor";
import { DiscordModifyCommandsInterceptor } from "./interceptor/discord.modify.commands.interceptor";

@Module({
    imports: [ConfigModule, CommandModule],
    providers: [
        DiscordManager,
        DiscordAddCommandsInterceptor,
        DiscordDeleteCommandsInterceptor,
        DiscordModifyCommandsInterceptor,
    ],
    exports: [
        DiscordManager,
        DiscordAddCommandsInterceptor,
        DiscordDeleteCommandsInterceptor,
        DiscordModifyCommandsInterceptor,
    ],
})
export class DiscordModule {}
