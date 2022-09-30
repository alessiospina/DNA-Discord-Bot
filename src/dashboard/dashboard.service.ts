/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { CommandService } from '../command/command.service';

@Injectable()
export class DashboardService {
    
    private readonly logger = new Logger(CommandService.name);

    constructor(
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
}