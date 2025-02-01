import { Events } from "discord.js"
import { DiscordClient } from "../classes/DiscordClient"

export default (client: DiscordClient) => {

    const cl = client.getClient()

    cl.on(Events.ClientReady, async () => {
        console.log('Bot is ready')

        // await client.uploadGuildsCommands()
        // console.log('Commands uploaded')

    })

}