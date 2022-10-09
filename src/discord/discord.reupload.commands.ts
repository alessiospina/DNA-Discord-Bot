/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, NestInterceptor, Logger, Injectable } from '@nestjs/common';
import { Observable, tap } from "rxjs";
import { DiscordManager } from './discord.manager';

@Injectable()
export class DiscordReuploadCommands implements NestInterceptor {
    private readonly logger = new Logger(DiscordReuploadCommands.name);

    constructor(private readonly discordManager: DiscordManager){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        this.logger.log("intercept() request")
        const now = Date.now()
        return next.handle().pipe(
            tap(() => {
                this.discordManager.updateCommands()
                this.logger.log(`Reupload commands after: ${Date.now() - now}ms`)
            })
        );
    }
    
}