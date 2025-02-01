import { SlashCommandBuilder } from "discord.js"

export type Command = {
    command: SlashCommandBuilder,
    execute: (interaction: any) => void
}

export type Component = {
    customId : string,
    execute: (interaction: any) => void
}