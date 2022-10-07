/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse();
        res.render('login')
    }
}