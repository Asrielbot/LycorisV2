// commands/faq.js
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import FAQ from "../database/faq.js";

const adminRoleName = "administration";

export const data = new SlashCommandBuilder()
  .setName("faq")
  .setDescription("Gérer les entrées de la FAQ")
  .addSubcommand(sub =>
    sub.setName("add")
      .setDescription("Ajouter une entrée à la FAQ")
      .addStringOption(opt => opt.setName("name").setDescription("Mot-clé").setRequired(true))
      .addStringOption(opt => opt.setName("content").setDescription("Réponse").setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName("remove")
      .setDescription("Supprimer une entrée de la FAQ")
      .addStringOption(opt => opt.setName("name").setDescription("Mot-clé").setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName("list")
      .setDescription("Afficher toutes les entrées de la FAQ")
  );

export async function execute(interaction) {
  const sub = interaction.options.getSubcommand();

  // Vérifie les permissions pour add/remove
  if (["add", "remove"].includes(sub)) {
    const hasRole = interaction.member.roles.cache.some(
      role => role.name.toLowerCase() === adminRoleName
    );

    if (!hasRole) {
      return interaction.reply({
        content: "⛔ Tu n’as pas la permission d’utiliser cette commande.",
        ephemeral: true,
      });
    }
  }

  try {
    if (sub === "add") {
      const name = interaction.options.getString("name").toLowerCase();
      const content = interaction.options.getString("content");

      await FAQ.findOneAndUpdate({ name }, { content }, { upsert: true });
      return interaction.reply(`✅ Entrée ajoutée/modifiée : \`${name}\``);
    }

    if (sub === "remove") {
      const name = interaction.options.getString("name").toLowerCase();
      const result = await FAQ.findOneAndDelete({ name });

      return interaction.reply(
        result
          ? `🗑️ Entrée supprimée : \`${name}\``
          : "⚠️ Aucune entrée trouvée avec ce nom."
      );
    }

    if (sub === "list") {
      const faqs = await FAQ.find({});

      if (faqs.length === 0) {
        return interaction.reply("📭 Aucune entrée dans la FAQ.");
      }

      const embed = new EmbedBuilder()
        .setTitle("📄 FAQ")
        .setColor("#5865F2")
        .setFooter({ text: "Utilise /faq-add ou /faq-remove pour modifier la FAQ" });

      faqs.forEach(faq => {
        embed.addFields({
          name: `🔹 ${faq.name}`,
          value: faq.content.length > 1024 ? faq.content.slice(0, 1021) + "…" : faq.content,
        });
      });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Fallback
    return interaction.reply("❌ Sous-commande inconnue.");
  } catch (err) {
    console.error(err);
    return interaction.reply("❌ Une erreur est survenue.");
  }
}