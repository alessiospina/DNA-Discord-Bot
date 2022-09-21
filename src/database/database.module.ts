/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Command } from '../command/command.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.getOrThrow<string>('DATABASE_HOST'),
                port: configService.getOrThrow<number>('DATABASE_PORT'),
                username: configService.getOrThrow<string>('DATABASE_USERNAME'),
                password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
                database: configService.getOrThrow<string>('DATABASE_SCHEMA'),
                entities: [Command],
                ssl: false,
                synchronize: true,
            }),
        }),
    ],
})
export class DatabaseModule {}