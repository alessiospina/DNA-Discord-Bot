/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Render } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { LoginRequestDto } from './auth/login.request.dto';
import { CommandService } from './command/command.service';

@Controller()
export class AppController {
    constructor(
        private readonly authService: AuthService,
        private readonly commandService: CommandService
    ) {}

    @Get()
    @Render('index')
    async root() {
        let commands = []
        try {
            commands = await this.commandService.findAll()
        } catch (error) {}
        return { commands: commands};
    }

    @Post('login')
    async login(@Body() loginRequest: LoginRequestDto) {
        return this.authService.login(loginRequest);
    }
}