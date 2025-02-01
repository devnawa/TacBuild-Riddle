import { Client, GatewayIntentBits } from "discord.js";
import DiscordService from "../services/DiscordService";
import { Command, Component } from "../types/Interactions";

export class DiscordClient {

    private token: string;
    private client: Client
    private commands: Command[] = [];
    private components: Component[] = [];

    constructor(token: string, intents: GatewayIntentBits[]){
        this.token = token;
        this.client = new Client({intents});
    }

    public addCommand(command: Command){
        this.commands.push(command);
    }

    public async login(){
        await this.client.login(this.token);
    }

    public getToken(): string {
        return this.token;
    }

    public getCommandsJSON(){
        return this.commands.map(command => command.command.toJSON());
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

    public getClient(){
        return this.client
    }

    public getCommand(name: string){
        return this.commands.find(command => command.command.name === name)
    }

    public addComponent(component: Component){
        this.components.push(component)
    }

    public getComponent(customId: string){
        return this.components.find(component => component.customId === customId)
    }

}