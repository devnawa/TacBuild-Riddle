import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Interaction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, User } from "discord.js";
import UserService from "../services/UserService";
import Riddles from "../lib/Riddles";
import { Riddle } from "../types/Riddle";

const idRandomizer = () => {
    return Math.random().toString(36).substring(7)
}

const RiddleUI = (riddle: Riddle) => {
    return new EmbedBuilder()
    .setTitle("Riddle")
    .setDescription(`**${riddle.riddle}**\n\nYou have 3 minutes to answer the riddle. After that, you should click the start button again.\nAfter clicking the answer button, you will have 3 minutes to answer the riddle.`)
    .setFooter({ text : "~nawa.dev"})
}

const AnswerButton = (randomId: string) => {
    return new ButtonBuilder()
    .setCustomId(`answer-${randomId}`)
    .setLabel("Answer")
    .setEmoji("🔍")
    .setStyle(ButtonStyle.Primary)
}

const DevButton = () => {
    return new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel("Contact Developer")
    .setURL("https://x.com/nawadotdev")
}

const CompletedUI = (user: User) => {
    return new EmbedBuilder()
    .setTitle("Riddle")
    .setDescription(`Congratulations ${user.username}, you have completed all the riddles!`)
    .setFooter({ text : "~nawa.dev"})
}

const InputModal = (customId: string) => {
    return new ModalBuilder()
    .setTitle("Answer")
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
            .setCustomId("answer")
            .setPlaceholder("Enter your answer")
            .setMinLength(1)
            .setMaxLength(100)
            .setRequired(true)
        )
    )
}

export default {
    customId : "start",
    execute : async (interaction: ButtonInteraction) => {

        await interaction.reply({ content : "Game starting...", ephemeral : true})
        await new Promise(resolve => setTimeout(resolve, 1000))

        var user = await UserService.UserRead(interaction.user.id)

        var currentRiddle = user?.currentRiddle || 0

        if(currentRiddle >= Riddles.length){
            await interaction.editReply({ content : "You have completed all the riddles!"})
            return
        }

        if(!user){
            await interaction.editReply({ content : "Initializing your account..."})
            await new Promise(resolve => setTimeout(resolve, 1000))
            await UserService.UserCreate(interaction.user.id)
        }

        await interaction.editReply({ content : "Starting the game..."})
        await new Promise(resolve => setTimeout(resolve, 1000))

        var randomId = idRandomizer()
        var riddle = Riddles[currentRiddle]

        await interaction.editReply({ content: "Riddle", embeds: [RiddleUI(riddle)], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(AnswerButton(randomId), DevButton())] })

        var filter = (i: Interaction) => {
            return i.isButton() && i.user.id === interaction.user.id && (i as ButtonInteraction).customId === `answer-${randomId}`;
        }

        if (!interaction.channel || !('createMessageComponentCollector' in interaction.channel)) {
            await interaction.reply({ content: "Channel not suitable for collectors.", ephemeral: true });
            return;
        }

        var collector = interaction.channel.createMessageComponentCollector({ filter, time: 180_000, max: 1 })

        collector.on('end', async (collected, reason) => {

            if(reason === 'time'){
                await interaction.editReply({ content : "Time's up!", components: []})
                return
            }

            var click = collected.first() as ButtonInteraction

            var randomId = idRandomizer()

            click.showModal(InputModal(randomId))

            var filter = (i : Interaction) => {
                return i.isModalSubmit() && i.user.id === interaction.user.id && (i as ModalSubmitInteraction).customId === `answer-${randomId}`;
            }

            click.awaitModalSubmit({ filter, time: 180_000 }).then(async (submit) => {

                var answer = submit.fields.fields.get('answer')?.value
                submit.deferUpdate()
                if(answer?.toLowerCase() === riddle.answer.toLowerCase()){
                    if(currentRiddle + 1 >= Riddles.length){
                        await interaction.editReply({ content : "Congratulations, you have completed all the riddles!", components: []})
                        return
                    }else{
                        await interaction.editReply({ content : "Correct answer! You can continue with the next ridle!", components: []})
                    }
                    await UserService.UserUpdate(interaction.user.id, { currentRiddle : currentRiddle + 1})
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    try{
                        await interaction.deleteReply()
                    }catch(_){}
                }else{
                    await interaction.editReply({ content : "Incorrect answer!", components: []}).then(async () => {
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        try{
                            await interaction.deleteReply()
                        }catch(_){}
                    })
                }

            }).catch(async (err) => {
                await interaction.editReply({ content : "Time's up!", components: []})
            })
        })

    }
}