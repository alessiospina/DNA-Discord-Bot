/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Render, Res, UseGuards } from "@nestjs/common";
import { LoginRequestDto } from "src/auth/login.request.dto";
import { DashboardService } from "./dashboard.service";
import { AuthService } from '../auth/auth.service';
import { LoginGuard } from "src/auth/login.auth.guard";
import { Response } from 'express';
import { AuthenticatedGuard } from "src/auth/authenticated.guard";


@Controller()
export class DashboardController {
    constructor(
        private readonly authService: AuthService,
        private readonly dashboardService: DashboardService
    ) {}

    @Get('/')
    @Render('login')
    index() {
      return;
    }

    @UseGuards(LoginGuard)
    @Post('/login')
    login(@Res() res: Response) {
      res.redirect('/dashboard');
    }

    @Get('/dashboard')
    @UseGuards(AuthenticatedGuard)
    @Render('index')
    async root() {
       return await this.dashboardService.getIndexData()
    }

    @Post('/jwt/login')
    async jwtLogin(@Body() loginRequest: LoginRequestDto) {
        return this.authService.login(loginRequest);
    }
}