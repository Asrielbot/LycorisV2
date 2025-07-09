// index.js
import "dotenv/config";
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectToMongoDB } from "./database/mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

console.log("Command files found:", commandFiles);

for (const file of commandFiles) {
  try {
    console.log(`Loading command from: ${file}`);
    const { default: command } = await import(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`Successfully loaded command: ${command.data.name}`);
  } catch (error) {
    console.error(`Failed to load command from ${file}:`, error);
  }
}

console.log("Total commands loaded:", client.commands.size);
console.log("Commands:", Array.from(client.commands.keys()));

// Load events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

console.log("Event files found:", eventFiles);

for (const file of eventFiles) {
  try {
    console.log(`Loading event from: ${file}`);
    const { default: event } = await import(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log(`Successfully loaded event: ${eventName}`);
  } catch (error) {
    console.error(`Failed to load event from ${file}:`, error);
  }
}

console.log("Total events loaded:", eventFiles.length);

await connectToMongoDB(process.env.MONGO_URI);

client.login(process.env.DISCORD_TOKEN);
