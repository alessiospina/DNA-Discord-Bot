/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, NestInterceptor, Logger, Injectable } from '@nestjs/common';
import { Observable, tap } from "rxjs";
import { DiscordManager } from '../discord.manager';

@Injectable()
export class DiscordAddCommandsInterceptor implements NestInterceptor {
    private readonly logger = new Logger(DiscordAddCommandsInterceptor.name);

    constructor(private readonly discordManager: DiscordManager){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        this.logger.log("intercept() request")
        const now = Date.now()
        return next.handle().pipe(
            tap(() => {
                const command = context.switchToHttp().getResponse().req.body
                this.discordManager.addCommand(command)
                this.logger.log(`add commands after: ${Date.now() - now}ms`)
            })
        );
    }
}