/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { Command } from "src/command/command.entity";
import { CommandService } from '../command/command.service';

@Injectable()
export class DnaBotManager {

    private readonly logger = new Logger(DnaBotManager.name);
    private commands: Command[] = []

    constructor(private readonly commandService: CommandService){}

    public async getCommands(): Promise<Command[]> {
        this.logger.log('getCommands(); incoming request')
        const commands = await this.commandService.findAll()
        this.logger.log('getCommands(): found ' + commands.length + ' commands.')
        return commands
    }
}