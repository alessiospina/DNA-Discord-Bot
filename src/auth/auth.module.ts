/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common"
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from './jwt.auth';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.getOrThrow<string>('JWT_SECRET'),
              signOptions: {
                expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN')
              }
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [AuthService, JwtStrategy],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {
    
}