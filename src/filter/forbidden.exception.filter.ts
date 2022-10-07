/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from "@nestjs/common";

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse();
        res.render('login')
    }
}