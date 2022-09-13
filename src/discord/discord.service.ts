/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'discord.js';

@Injectable()
export class DiscordService {
    private readonly client: Client
    private readonly logger = new Logger(DiscordService.name);

    constructor(private readonly configService: ConfigService){
        this.client = new Client({ intents: [ 'DirectMessages', 'Guilds', 'GuildMessages', 'MessageContent'] })
        const token: string = this.configService.getOrThrow<string>('DISCORD_TOKEN')
        
        this.client.on('ready',async (data: Client) => {
            this.logger.log('WatsonBot is ready to listen')
        })

        this.client.on('messageCreate', (msg) => {
            this.logger.log('Message created: ' + JSON.stringify(msg))
        })

        this.client.login(token)
            .then((res) => {
                this.logger.log('Authentication successfully')
            })
            .catch((error) => {
                this.logger.error(error)
            })    
    }
}
