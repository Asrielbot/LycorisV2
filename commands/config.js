// commands/config.js
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Activer ou désactiver un module du bot")
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription("Nom du module à configurer (ex: onboarding, faq)")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("enable")
        .setDescription("Activer (true) ou désactiver (false)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const module = interaction.options.getString("module");
    const enable = interaction.options.getBoolean("enable");

    // Ex: stocker dans un fichier JSON temporaire ou MongoDB plus tard
    interaction.client.config = interaction.client.config || {};
    interaction.client.config[module] = enable;

    await interaction.reply({
      content: `Le module \`${module}\` a été ${
        enable ? "activé" : "désactivé"
      }.`,
      ephemeral: true,
    });
  },
};
