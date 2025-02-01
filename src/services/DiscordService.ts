import { REST, Routes } from "discord.js";
import { DiscordClient } from "../classes/DiscordClient";

const uploadGuildCommands = async (client:DiscordClient) => {

    const rest = new REST().setToken(client.getToken())

    const applicationId = client.getApplicaitonId();

    if(!applicationId){
        throw new Error('Application ID not found')
    }

    const commands = client.getCommandsJSON();

    const guilds = await client.getGuilds()

    for(const guild of guilds){
        console.log(`Uploading commands to ${guild[1].name}`)
        await rest.put( 
            Routes.applicationGuildCommands(applicationId, guild[1].id),
            { body : commands}
        )
    }

}

export default {
    uploadGuildCommands
}