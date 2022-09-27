/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Request } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { LoginRequestDto } from './auth/login.request.dto';

@Controller()
export class AppController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginRequest: LoginRequestDto) {
        return this.authService.login(loginRequest);
    }
}