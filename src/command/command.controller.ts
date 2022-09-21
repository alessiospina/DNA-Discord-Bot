/* eslint-disable prettier/prettier */
import { Body, Controller, DefaultValuePipe, Get, Headers, ParseIntPipe, Post, Query } from "@nestjs/common";
import { Pagination } from "nestjs-typeorm-paginate";
import { CommandService } from './command.service';
import { CommandDto } from "./command.dto";
import { ServerResponse } from "src/common/server.response";
import { plainToClass } from "@nestjs/class-transformer";

@Controller('command')
export class CommandController {
    constructor(private readonly commandService: CommandService) {}

    @Get()
    async get(
        @Headers('host') host: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1, 
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
    ): Promise<ServerResponse<Pagination<CommandDto>>> {
        const res = await this.commandService.find({ page, limit, route: 'http://' + host})
        const resDto = new Pagination<CommandDto>(plainToClass(CommandDto, res.items), res.meta, res.links)
        return ServerResponse.success(resDto);
    }

    @Get('/all')
    async getAll(): Promise<ServerResponse<CommandDto[]>> {
        const res = await this.commandService.findAll()
        return ServerResponse.success(plainToClass(CommandDto, res));
    }

    @Post()
    async add(@Body() command: CommandDto) {
        const created = await this.commandService.add(command);
        return ServerResponse.success(plainToClass(CommandDto, created));
    }
}