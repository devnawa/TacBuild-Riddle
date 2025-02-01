import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const UI = new EmbedBuilder()
.setTitle("TAC.Build Riddle")
.setDescription("Welcome to the TAC.Build Riddle Bot")
.addFields(
    { name : "How to Play", value : "Instructions", inline : true},
    { name : "Twitter How To Share", value : "Instructions", inline : true},
)
.setFooter({ text : "~nawa.dev"})

const Buttons = new ActionRowBuilder<ButtonBuilder>()
.addComponents(
    new ButtonBuilder()
    .setCustomId("start")
    .setLabel("Start")
    .setEmoji("🎮")
    .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel("Contact Developer")
    .setURL("https://x.com/nawadotdev")
)

export default {
    command : new SlashCommandBuilder()
    .setName("ui")
    .setDescription("Send the user interface to the channel command was used in")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute : async (interaction: ChatInputCommandInteraction) => {

        if(interaction.isAutocomplete()) return 

        if(interaction.channel?.isSendable()) return await interaction.reply({ content : "I can't send messages in this channel", ephemeral : true})

        try{
            await interaction.reply({ embeds : [UI], components : [Buttons]})
        }catch(_){
            await interaction.reply({ content : "Failed to send UI", components : [Buttons], ephemeral : true})
        }
    }
}