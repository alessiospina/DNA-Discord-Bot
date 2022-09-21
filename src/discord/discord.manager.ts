/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { DnaBotManager } from '../dnabot/dnabot.manager';

@Injectable()
export class DiscordManager {
    private readonly rest: REST
    private readonly client: Client
    private readonly logger = new Logger(DiscordManager.name);

    private readonly commandsMap: Map<string, string> = new Map()

    constructor(
        private readonly configService: ConfigService,
        private readonly dnabotManager: DnaBotManager
    ){
        this.client = new Client({ intents: [ 'DirectMessages', 'Guilds', 'GuildMessages', 'MessageContent'] })
        const token: string = this.configService.getOrThrow<string>('DISCORD_TOKEN')
        const applicationId: string = this.configService.getOrThrow<string>('DISCORD_APPLICATION_ID')

        this.rest = new REST({ version: '10' }).setToken(token);

        (async () => {
            const commands = await this.dnabotManager.getCommands();
            const discordCommands: any[] = []
    
            for (const command of commands) {
                discordCommands.push(new SlashCommandBuilder().setName(command.action).setDescription(command.response).toJSON())
                this.commandsMap.set(command.action, command.response)
            }
            
            this.rest.put(Routes.applicationCommands(applicationId), { body: discordCommands })
                .then((data: SlashCommandBuilder[]) => this.logger.log(`Successfully registered ${data.length} application commands.`))
                .catch((error) => this.logger.error(error));
        })();

        this.client.on('ready', () => {
            this.logger.log("DnaBot ready to listen")    
        });
        
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;
            this.logger.log('interactionCreated(): user input:' + interaction.commandName)
            
            if (this.commandsMap.has(interaction.commandName)) {
                await interaction.reply(this.commandsMap.get(interaction.commandName));
            }
        });
          
        this.client.login(token);
    }



}
