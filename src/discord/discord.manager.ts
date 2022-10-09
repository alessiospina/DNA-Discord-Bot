/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Routes, SlashCommandBuilder } from 'discord.js';
import { Command } from 'src/command/command.entity';
import { CommandService } from '../command/command.service';

@Injectable()
export class DiscordManager {
    private readonly client: Client
    private readonly logger = new Logger(DiscordManager.name);
    private readonly token: string
    private readonly applicationId: string
    private readonly commandsMap: Map<string, string> = new Map()

    constructor(
        private readonly configService: ConfigService,
        private readonly commandService: CommandService
    ){
        this.client = new Client({ intents: [ 'DirectMessages', 'Guilds', 'GuildMessages', 'MessageContent'] })
        this.token = this.configService.getOrThrow<string>('DISCORD_TOKEN')
        this.applicationId = this.configService.getOrThrow<string>('DISCORD_APPLICATION_ID')

        this.client.once('ready', () => {
            this.logger.log("DnaBot ready to listen")

            this.client.on('interactionCreate', async interaction => {
                if (!interaction.isChatInputCommand()) return;
                
                this.logger.log('startBot() - interactionCreated(): user input:' + interaction.commandName)
                
                if (this.commandsMap.has(interaction.commandName)) {
                    await interaction.reply(this.commandsMap.get(interaction.commandName));
                }
            });        
        })

        this.client.login(this.token)
    }


    
    public async registerCommands() {
        this.logger.log('startBot() - request incoming')
        let commands: Command[] = []
        try {
            commands = await this.commandService.findAll();
        } catch (error) {
            this.logger.error("Error during command getCommands(): " + JSON.stringify(error))
        }
        const discordCommands: any[] = []

        for (const command of commands) {
            discordCommands.push(new SlashCommandBuilder().setName(command.action).setDescription(command.description).toJSON())
            this.commandsMap.set(command.action, command.response)
        }
        try {
            await this.client.rest.put(Routes.applicationCommands(this.applicationId), { body: discordCommands })
            this.logger.log('registerCommands() - discord command registered, size: ' + discordCommands.length)
        }
        catch(error) {
            this.logger.log('registerCommands() - error: ' + JSON.stringify(error))
        }
    }

    public async resetCommands() {
        try {
            await this.client.rest.put(Routes.applicationCommands(this.applicationId), { body: [] })
            this.logger.log('resetCommands() - discord commands reset')
        } catch (error) {
            this.logger.log('resetCommands() - error: ' + JSON.stringify(error))
        }
    }

    public async updateCommands() {
        await this.resetCommands()
        await this.registerCommands()
    }
}
