/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CommandService } from '../command/command.service';
import { CommandDto } from '../command/command.dto';

@Injectable()
export class DashboardService {
    
    private readonly logger = new Logger(DashboardService.name);

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


    async createCommand(command: CommandDto): Promise<any> {
        try {
            this.logger.log('createCommand() incoming request')
            return await this.commandService.add(command);
        } catch (error) {
            this.logger.error('createCommand() error:' + JSON.stringify(error))
            throw new InternalServerErrorException();
            
        }
    }
}