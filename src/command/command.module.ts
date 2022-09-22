import { Module } from "@nestjs/common";
import { CommandService } from "./command.service";
import { CommandController } from "./command.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Command } from "./command.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Command])],
    providers: [CommandService],
    controllers: [CommandController],
    exports: [CommandService],
})
export class CommandModule {}
