/* eslint-disable prettier/prettier */
import { plainToClass } from "@nestjs/class-transformer";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ServerResponse } from "src/common/server.response";
import { UserDto } from "./user.dto";
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/all')
    async getAll(): Promise<ServerResponse<UserDto[]>> {
        const res = await this.userService.findAll()
        return ServerResponse.success(plainToClass(UserDto, res));
    }

    @Post()
    async add(@Body() user: UserDto) {
        const created = await this.userService.add(user);
        return ServerResponse.success(plainToClass(UserDto, created));
    }

    @Delete('/:id')
    async delete(@Param() id: number) {
        const created = await this.userService.delete(id);
        return ServerResponse.success(plainToClass(UserDto, created));
    }

}