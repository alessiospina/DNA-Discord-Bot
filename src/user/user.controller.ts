/* eslint-disable prettier/prettier */
import { plainToClass } from "@nestjs/class-transformer";
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { ServerResponse } from "src/common/server.response";
import { UserDto } from "./user.dto";
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/all')
    @UseGuards(JwtAuthGuard)
    async getAll(): Promise<ServerResponse<UserDto[]>> {
        const res = await this.userService.findAll()
        return ServerResponse.success(plainToClass(UserDto, res));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async add(@Body() user: UserDto) {
        const created = await this.userService.add(user);
        return ServerResponse.success(plainToClass(UserDto, created));
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param() id: number) {
        const created = await this.userService.delete(id);
        return ServerResponse.success(plainToClass(UserDto, created));
    }

}