/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse();
        res.render('notfound')
    }
}