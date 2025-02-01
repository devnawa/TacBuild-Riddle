import "dotenv/config";
import { DiscordClient } from "./classes/DiscordClient";
import { readdirSync } from "fs";
import { connectDB } from "./lib/Database";
import { GatewayIntentBits } from "discord.js";


const MONGO_URI = process.env.MONGO_URI as string

const TOKEN = process.env.DISCORD_BOT_TOKEN as string
const client = new DiscordClient(TOKEN, [
    GatewayIntentBits.Guilds
])

const events = readdirSync('./src/events').filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for(const file of events){
    import(`./events/${file}`).then(event => event.default(client))
}

const commands = readdirSync('./src/commands').filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for(const file of commands){
    import(`./commands/${file}`).then(c => c.default).then(c => client.addCommand(c))
}

const components = readdirSync('./src/components').filter(file => file.endsWith('.ts') || file.endsWith('.js'));
for(const file of components){
    import(`./components/${file}`).then(c => c.default).then(c => client.addComponent(c))
}

connectDB(MONGO_URI).then((res) => {
    if(res){
        client.login()
    }else{
        console.log('Failed to connect to database')
    }
})