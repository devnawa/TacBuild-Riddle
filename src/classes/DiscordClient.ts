import { Client, GatewayIntentBits, SlashCommandBuilder } from "discord.js";
import DiscordService from "../services/DiscordService";

export class DiscordClient {

    private token: string;
    private intents: GatewayIntentBits[];
    private client: Client
    private commands: SlashCommandBuilder[] = [];

    constructor(token: string, intents: GatewayIntentBits[]){
        this.token = token;
        this.intents = intents;
        this.client = new Client({intents: this.intents});
    }

    public addCommand(command: SlashCommandBuilder){
        this.commands.push(command);
    }

    public async login(){
        await this.client.login(this.token);
    }

    public getToken(): string {
        return this.token;
    }

    public getCommandsJSON(){
        return this.commands.map(command => command.toJSON());
    }

    public async getGuilds(){
        return await this.client.guilds.fetch()
    }

    public getApplicaitonId(){
        return this.client.user?.id
    }

    public async uploadGuildsCommands(){
        await DiscordService.uploadGuildCommands(this)
    }

}