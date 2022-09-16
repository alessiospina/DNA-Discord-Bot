/* eslint-disable prettier/prettier */
import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
import { Pagination } from "nestjs-typeorm-paginate";
import { CommandService } from './command.service';
import { Command } from './command.entity';
import { CommandDto } from "./command.dto";
import { ServerResponse } from "src/common/server.response";
import { plainToClass } from "@nestjs/class-transformer";

@Controller('command')
export class CommandController {
    constructor(private readonly commandService: CommandService) {}

    @Get()
    async get(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1, 
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
    ): Promise<ServerResponse<Pagination<CommandDto>>> {
        const res = await this.commandService.find({ page, limit, route: 'http://cats.com/cats'})
        const resDto = new Pagination<CommandDto>(plainToClass(CommandDto, res.items), res.meta, res.links)
        return ServerResponse.success(resDto);
    }

    @Post()
    async add(@Body() command: CommandDto) {
        const created = await this.commandService.add(command);
        return ServerResponse.success(plainToClass(CommandDto, created));
    }
}