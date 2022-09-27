/* eslint-disable prettier/prettier */
import { Body, Controller, DefaultValuePipe, Delete, Get, Headers, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { Pagination } from "nestjs-typeorm-paginate";
import { CommandService } from './command.service';
import { CommandDto } from "./command.dto";
import { ServerResponse } from "src/common/server.response";
import { plainToClass } from "@nestjs/class-transformer";
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";

@Controller('command')
export class CommandController {
    constructor(private readonly commandService: CommandService) {}

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    async getAll(): Promise<ServerResponse<CommandDto[]>> {
        const res = await this.commandService.findAll()
        return ServerResponse.success(plainToClass(CommandDto, res));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async add(@Body() command: CommandDto) {
        const created = await this.commandService.add(command);
        return ServerResponse.success(plainToClass(CommandDto, created));
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param() id: number) {
        const created = await this.commandService.delete(id);
        return ServerResponse.success(plainToClass(CommandDto, created));
    }
}