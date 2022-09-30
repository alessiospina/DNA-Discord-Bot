import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { CommandModule } from "../command/command.module";
import { AuthModule } from "src/auth/auth.module";
import { DashboardController } from "./dashboard.controller";

@Module({
    imports: [AuthModule, CommandModule],
    providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule {}
