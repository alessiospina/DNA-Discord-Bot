import { CommandModule } from "./command/command.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordModule } from "./discord/discord.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
    imports: [
        DashboardModule,
        UserModule,
        ConfigModule.forRoot(),
        DatabaseModule,
        CommandModule,
        DiscordModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
