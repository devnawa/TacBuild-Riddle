import { BaseInteraction, Events, InteractionType, MessageComponentInteraction } from "discord.js"
import { DiscordClient } from "../classes/DiscordClient"

export default (client: DiscordClient) => {

    const cl = client.getClient()

    cl.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
        if(!interaction.isCommand() && !interaction.isMessageComponent()) return

        let command = null

        if(interaction.isMessageComponent()){
            command = client.getComponent((interaction as MessageComponentInteraction).customId)
        }else if(interaction.isChatInputCommand()){
            command = client.getCommand(interaction.commandName)
        }

        if(command){
            try{
                command.execute(interaction)
            }catch(_){
                if(interaction.replied || interaction.deferred){
                    await interaction.followUp({ content : "Failed to execute command", ephemeral : true})
                }else{
                    await interaction.reply({ content : "Failed to execute command", ephemeral : true})
                }
            }
            return
        }



    })

}