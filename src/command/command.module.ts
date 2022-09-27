import { Module } from "@nestjs/common";
import { CommandService } from "./command.service";
import { CommandController } from "./command.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Command } from "./command.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Command]), AuthModule],
    providers: [CommandService],
    controllers: [CommandController],
    exports: [CommandService],
})
export class CommandModule {}
