/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        
        if(request.url && !request.url.includes('/api/'))
            return response.render('login')  
        
        response.status(status).json({
            message: "Unauthorized"
        });
    }
}