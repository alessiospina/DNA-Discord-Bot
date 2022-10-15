/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Routes, SlashCommandBuilder } from 'discord.js';
import { Command } from 'src/command/command.entity';
import { CommandService } from '../command/command.service';
import { CommandDto } from '../command/command.dto';
import { DiscordCommandDto } from './dto/command.discord.dto';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class DiscordManager {
    private readonly client: Client
    private readonly logger = new Logger(DiscordManager.name);
    private readonly token: string
    private readonly applicationId: string
    private readonly commandsMap: Map<string, CommandDto> = new Map()

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
                
                this.logger.log('onInteraction() - user input: ' + interaction.commandName)
                
                if (this.commandsMap.has(interaction.commandName)) {
                    await interaction.reply(this.commandsMap.get(interaction.commandName).response);
                }
            });        
        })

        this.client.login(this.token)
        this.loadResponseCommandsMap()
    }

    public async addCommand(command: CommandDto) {
        this.logger.log('addCommand() - incoming request with command: ' + JSON.stringify(command))
        try {
            const slashCommand = new SlashCommandBuilder().setName(command.action).setDescription(command.description).toJSON()
            const discordCommandSaved = await this.client.rest.post(Routes.applicationCommands(this.applicationId), {body: slashCommand})
            command.discordId = discordCommandSaved['id']
            await this.commandService.add(command)
            this.commandsMap.set(command.action, command)
        } catch (error) {
            this.logger.error('addCommand() - error: ' + JSON.stringify(error))
        }
    }

    public async deleteCommand(command: CommandDto) {
        this.logger.log('deleteCommand() - incoming request with command: ' + JSON.stringify(command))
        const commandToDelete = this.commandsMap.get(command.action)
        try {
            await this.client.rest.delete(Routes.applicationCommand(this.applicationId, commandToDelete.discordId))
            await this.commandService.delete(commandToDelete.id)
            this.commandsMap.delete(command.action)
        } catch (error) {
            this.logger.error('deleteCommand() - error: ' + JSON.stringify(error))
        }
    }

    public async modifyCommand(command: CommandDto) {
        this.logger.log('modifyCommand() - incoming request with command: ' + JSON.stringify(command))
        const commandToModify = this.commandsMap.get(command.action)
        if(!commandToModify)
            throw new NotFoundException()
        try {
            const slashCommand = new SlashCommandBuilder().setName(commandToModify.action).setDescription(command.description).toJSON()
            const commandModified = await this.client.rest.patch(Routes.applicationCommand(this.applicationId, commandToModify.discordId), {body: slashCommand})
            commandToModify.discordId = commandModified['id']
            commandToModify.response = command.response
            await this.commandService.modify(commandToModify)
            this.commandsMap.set(command.action, commandToModify)
        } catch (error) {
            this.logger.error('modifyCommand() - error: ' + JSON.stringify(error))
        }
    }

    public async getAllCommands(): Promise<DiscordCommandDto[]> {
        const commands = await this.client.rest.get(Routes.applicationCommands(this.applicationId))
        return plainToClass(Array<DiscordCommandDto>, commands)
    }

    private async loadResponseCommandsMap(){
        const commandsFromDiscord = await this.getAllCommands()
        for (const command of commandsFromDiscord) {
            try {
                const commandFromDb = await this.commandService.findByAction(command.name)
                commandFromDb.discordId = command.id
                this.commandsMap.set(commandFromDb.action, commandFromDb)
            } catch (error) {
                this.logger.error("loadResponseCommandsMap() - error: " + JSON.stringify(error))
                if(error instanceof NotFoundException) {
                    const data = new Command(
                        null, 
                        command.name, 
                        command.description, 
                        'Ops risposta non definita.',
                        command.id,
                        null,
                        null)
                    try {
                        const newCommand = await this.commandService.add(data)
                        this.commandsMap.set(newCommand.action, newCommand)
                    } catch (e) {
                        this.logger.error("loadResponseCommandsMap() - error during saving command: " + JSON.stringify(e))
                    }
                }
            }
        }
    }
}
