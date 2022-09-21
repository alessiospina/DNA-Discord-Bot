/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { DnaBotManager } from './dnabot.manager';
import { CommandModule } from '../command/command.module';

@Module({
    imports: [CommandModule],
    providers: [DnaBotManager],
    controllers: [],
    exports: [DnaBotManager]
})
export class DnaBotModule {}