/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from "@nestjs/common";

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        
        if(request.url && !request.url.includes('/api/'))
            return response.render('login')  
        
        response.status(status).json({
            message: "Forbidden"
        });
    }
}