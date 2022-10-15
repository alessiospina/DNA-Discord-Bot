/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { DiscordManager } from "../discord.manager";

@Injectable()
export class DiscordModifyCommandsInterceptor implements NestInterceptor {
    private readonly logger = new Logger(DiscordModifyCommandsInterceptor.name);

    constructor(private readonly discordManager: DiscordManager){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        this.logger.log("intercept() request")
        const now = Date.now()
        return next.handle().pipe(
            tap(() => {
                const command = context.switchToHttp().getResponse().req.body
                this.discordManager.modifyCommand(command)
                this.logger.log(`modify commands after: ${Date.now() - now}ms`)
            })
        );
    }
}