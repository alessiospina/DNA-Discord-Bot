/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Command } from './command.entity';

@Injectable()
export class CommandService {

    private readonly logger = new Logger(CommandService.name);
    
    constructor(
        @InjectRepository(Command) private readonly commandRepository: Repository<Command>
    ) {}

    public async find(options: IPaginationOptions): Promise<Pagination<Command>> {
        this.logger.log('find() - incoming request with options: ' + JSON.stringify(options))
        options.limit = options.limit > 100 ? 100 : options.limit;
        const res = await paginate<Command>(this.commandRepository, options);
        this.logger.log('find() - finished with list item length:' + res.items.length)
        return res;
    }

    public async add(toSave: Command): Promise<Command> {
        this.logger.log('add() - incoming request with obj: ' + JSON.stringify(toSave))
        let saved = undefined
        try {
            saved = await this.commandRepository.save(toSave);
        } catch (error) {
            this.logger.error('add() - error: ' + error)
            if(error.sqlState === '23000')
                throw new HttpException("Command Error: action [" + toSave.action + "] already exists", HttpStatus.BAD_REQUEST);
            throw new HttpException("Command Error during command creation", HttpStatus.INTERNAL_SERVER_ERROR)    
        }
        this.logger.log('add() - command created: ' + JSON.stringify(saved))
        return saved
    }
}
