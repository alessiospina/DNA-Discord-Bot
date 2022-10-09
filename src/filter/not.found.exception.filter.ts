/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        
        if(request.url && !request.url.includes('/api/'))
            return response.render('notfound')  
        
        response.status(status).json({
            message: "Not Found"
        });
    }
}