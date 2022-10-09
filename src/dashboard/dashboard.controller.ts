/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Post, Render, Request, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { LoginRequestDto } from "src/auth/login.request.dto";
import { DashboardService } from "./dashboard.service";
import { AuthService } from '../auth/auth.service';
import { LoginGuard } from "src/auth/login.auth.guard";
import { AuthenticatedGuard } from "src/auth/authenticated.guard";
import { Response } from 'express'
import { CommandDto } from '../command/command.dto';
import * as moment from 'moment'
import { DiscordManager } from '../discord/discord.manager';
import { DiscordReuploadCommands } from '../discord/discord.reupload.commands';

@Controller()
export class DashboardController {
    constructor(
        private readonly authService: AuthService,
        private readonly dashboardService: DashboardService,
        private readonly discordManager: DiscordManager
    ) {}

    @Get('/')
    @Render('login')
    async index() {
      return;
    }

    @UseGuards(LoginGuard)
    @Post('/login')
    async login(@Res() res: Response) {
      res.redirect('/dashboard');
    }

    @Get('/dashboard')
    @UseGuards(AuthenticatedGuard)
    @Render('index')
    async root(@Request() req) {
        console.log("")
        return {
            moment: moment,
            username: req.user.username,
            data: await this.dashboardService.getIndexData() 
        }
    }

    @Post('/jwt/login')
    async jwtLogin(@Body() loginRequest: LoginRequestDto) {
        return this.authService.login(loginRequest);
    }

    @Get('/logout')
    async logout(@Request() req, @Res() res: Response) {
        req.session.destroy()
        res.redirect('/');
    }

    @Post('/dashboard/create/command')
    @UseInterceptors(DiscordReuploadCommands)
    @UseGuards(AuthenticatedGuard)
    async createCommand(@Body() command: CommandDto) {
        return this.dashboardService.createCommand(command)
    }

    @Delete('/dashboard/delete/command')
    @UseInterceptors(DiscordReuploadCommands)
    @UseGuards(AuthenticatedGuard)
    async deleteCommand(@Body() command: CommandDto) {
        return this.dashboardService.deleteCommand(command)
    }

    @Get('/dashboard/reupload/commands/')
    @UseGuards(AuthenticatedGuard)
    async restartBot() {
        return this.discordManager.updateCommands()
    }
}