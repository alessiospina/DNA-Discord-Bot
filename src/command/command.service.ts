/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CommandDto } from './command.dto';
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

    public async findAll(): Promise<Command[]> {
        this.logger.log('findAll() - incoming request')
        let found: Command[] = []
        try {
            found = await this.commandRepository.find();
        } catch (error) {
            this.logger.error('findAll() - error: ' + error)
            throw new HttpException("Command Error during fetch all commands", HttpStatus.INTERNAL_SERVER_ERROR)    
        }

        if(!found || found.length <= 0) {
            this.logger.warn('findAll(): no content')
            throw new HttpException("No content", HttpStatus.NO_CONTENT)
        }

        this.logger.log('findAll() - commands list size: ' + found.length)
        return found
    }

    public async findById(id: number): Promise<Command> {
        let found = undefined
        try {
            found = await this.commandRepository.findOneBy({ id: id });
        } catch (error) {
            this.logger.error('findById() - error: ' + error)
            throw new HttpException("Command Error during the command selection", HttpStatus.INTERNAL_SERVER_ERROR)   
        }
        if(!found) {
            this.logger.warn('find() obj id: ' + id + ' not found')
            throw new HttpException('Command not found', HttpStatus.NOT_FOUND)
        }

        return found
    }

    public async add(toSave: CommandDto): Promise<Command> {
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

    public async delete(id: number): Promise<Command> {
        this.logger.log('delete() - incoming request with id: ' + id)
        let found = undefined

        try {
            found = await this.findById(id)
        } catch (error) {
            this.logger.error('delete() - error: ' + error)
            if(!(error instanceof HttpException))
                throw new HttpException('Error during delete operation', HttpStatus.INTERNAL_SERVER_ERROR)
            if(error.getStatus() === HttpStatus.NOT_FOUND)
                throw new HttpException('Command not exists', HttpStatus.NO_CONTENT)
            throw error
        }
        
        let deleted = undefined

        try {
            deleted = (await this.commandRepository.delete(id)).affected
        } catch (error) {
            this.logger.error('delete() - error: ' + error)
            throw new HttpException('Error during delete operation', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        if(deleted === null || deleted === 0) {
            this.logger.error('delete() - delete operation not affected with id: ' + id)
			throw new HttpException('Error during delete operation', HttpStatus.INTERNAL_SERVER_ERROR);
		}

        return found
    }
}
