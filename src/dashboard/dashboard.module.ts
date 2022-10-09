import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { CommandModule } from "../command/command.module";
import { AuthModule } from "src/auth/auth.module";
import { DashboardController } from "./dashboard.controller";
import { DiscordModule } from "../discord/discord.module";

@Module({
    imports: [AuthModule, CommandModule, DiscordModule],
    providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule {}
