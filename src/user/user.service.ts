/* eslint-disable prettier/prettier */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService{
    private readonly logger = new Logger(UserService.name);
    
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    public async findAll(): Promise<User[]> {
        this.logger.log('findAll() - incoming request')
        let found: User[] = []
        try {
            found = await this.userRepository.find()
        } catch (error) {
            this.logger.error('findAll() - error: ' + JSON.stringify(error))
            throw new HttpException("Error during find users", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!found || found.length <= 0) {
            this.logger.warn('findAll() - no content.')
            throw new HttpException('No content', HttpStatus.NO_CONTENT)
        }
        this.logger.log('findAll() - user list length:  ' + found.length)
        return found
    }

    public async findById(id: number): Promise<User> {
        this.logger.log('findById() - incoming request with id: ' + id)
        let found: User = undefined
        try {
            found = await this.userRepository.findOneBy({ id: id });
        } catch(error) {
            this.logger.error('findById() - error: ' + JSON.stringify(error))
            throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if(!found) {
            this.logger.warn('findById() - user id: ' + id + ' not found.')
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return found  
    }

    public async findByUsername(username: string): Promise<User> {
        this.logger.log('findByUsername() - incoming request with username: ' + username)
        let found: User = undefined
        try {
            found = await this.userRepository.findOneBy({ username: username });
        } catch(error) {
            this.logger.error('findByUsername() - error: ' + JSON.stringify(error))
            throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if(!found) {
            this.logger.warn('findByUsername() - username: ' + username + ' not found.')
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return found  
    }

    public async add(user: User): Promise<User> {
        this.logger.log('add() - incoming request, user: ' + JSON.stringify(user))
        let saved: User = undefined
        try {
            saved = await this.userRepository.save(user)
        } catch (error) {
            this.logger.error('add() - error: ' + JSON.stringify(error))
            throw new HttpException('Error during creation', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        this.logger.log('add() - user saved: ' + JSON.stringify(saved))
        return saved
    }

    public async delete(id: number): Promise<User> {
        this.logger.log('delete() - incoming operation: ' + id)
        let found = undefined
        try {
            found = await this.findById(id)
        } catch (error) {
            this.logger.error('delete() - error: ' + JSON.stringify(error))
            if(!(error instanceof HttpException))
                throw new HttpException('Error during delete operation.', HttpStatus.INTERNAL_SERVER_ERROR)
            if(error.getStatus() === HttpStatus.NOT_FOUND)
                throw new HttpException('No Content', HttpStatus.NO_CONTENT)
            throw error
        }
        let deleted = undefined
        try {
            deleted = (await this.userRepository.delete(id)).affected
        } catch(error) {
            this.logger.error('delete() - error: ' + JSON.stringify(error))
            throw new HttpException('Error during delete operation.', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if(!deleted) {
            this.logger.error('delete() - delete operation not affected with id: ' + id)
			throw new HttpException('Error during delete operation', HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return found
    }
}