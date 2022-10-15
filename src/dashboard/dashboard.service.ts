/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CommandService } from '../command/command.service';
import { CommandDto } from '../command/command.dto';
import { DiscordManager } from '../discord/discord.manager';

@Injectable()
export class DashboardService {
    
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        private readonly discordManager: DiscordManager,
        private readonly commandService: CommandService
    ) {}


    async getIndexData(): Promise<any> {
        let commands = []
        try {
            this.logger.log('getIndexData() incoming request')
            commands = await this.commandService.findAll()
        } catch (error) {
            this.logger.error('getIndexData() error: ' + JSON.stringify(error))
        }
        return { commands: commands }
    }


    async createCommand(command: CommandDto): Promise<any> {
        try {
            this.logger.log('createCommand() incoming request')
            return await this.discordManager.addCommand(command)
        } catch (error) {
            this.logger.error('createCommand() error:' + JSON.stringify(error))
            throw new InternalServerErrorException(error.message);
            
        }
    }

    async deleteCommand(command: CommandDto): Promise<any> {
        try {
            return await this.discordManager.deleteCommand(command)
        } catch (error) {
            this.logger.error('deleteCommand() error:' + JSON.stringify(error))
            throw new InternalServerErrorException(error.message);
        }
    }

    async modifyCommand(command: CommandDto): Promise<any> {
        try {
            return await this.discordManager.modifyCommand(command);
        } catch (error) {
            this.logger.error('modifyCommand() error:' + JSON.stringify(error))
            throw new InternalServerErrorException(error.message);
        }
    }
}