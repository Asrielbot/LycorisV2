// deploy-commands.js
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

console.log("Command files found for deployment:", commandFiles);

for (const file of commandFiles) {
  try {
    console.log(`Loading command for deployment: ${file}`);
    const { default: command } = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
    console.log(`Successfully loaded command for deployment: ${command.data.name}`);
  } catch (error) {
    console.error(`Failed to load command for deployment from ${file}:`, error);
  }
}

console.log("Total commands to deploy:", commands.length);
console.log("Commands to deploy:", commands.map(cmd => cmd.name));

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("🔁 Déploiement des commandes slash…");

  // Deploy as guild commands (appears immediately)
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  console.log("✅ Commandes enregistrées avec succès.");
} catch (error) {
  console.error("❌ Erreur lors de l’enregistrement :", error);
}
