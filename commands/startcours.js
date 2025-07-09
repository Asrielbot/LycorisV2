// commands/startcours.js
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("startcours")
    .setDescription("Crée un nouveau salon vocal et textuel pour un cours")
    .addStringOption((option) =>
      option
        .setName("matiere")
        .setDescription("Nom de la matière (ex: Mathématiques, Physique)")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // Check if user has permission to manage channels
      // TODO: Implement role-based permission system later
      /*
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        await interaction.reply({
          content: "❌ Vous n'avez pas la permission de créer des salons vocaux.",
          ephemeral: true,
        });
        return;
      }
      */

      const guild = interaction.guild;
      const matiere = interaction.options.getString("matiere");
      const textChannelName = `${matiere}`;
      const voiceChannelName = `Cours : ${matiere}`;
      
      // Create the text channel first
      const textChannel = await guild.channels.create({
        name: textChannelName,
        type: 0, // Text channel
        reason: `Cours créé par ${interaction.user.username}`,
      });

      // Create the voice channel
      const voiceChannel = await guild.channels.create({
        name: voiceChannelName,
        type: 2, // Voice channel
        reason: `Cours créé par ${interaction.user.username}`,
      });

      console.log(`Created text channel: ${textChannel.name} (${textChannel.id})`);
      console.log(`Created voice channel: ${voiceChannel.name} (${voiceChannel.id})`);

      // Schedule deletion at 18:00
      const now = new Date();
      const deleteTime = new Date();
      deleteTime.setHours(18, 0, 0, 0); // 18:00:00.000
      
      // If it's already past 18:00, schedule for tomorrow
      if (now.getTime() > deleteTime.getTime()) {
        deleteTime.setDate(deleteTime.getDate() + 1);
      }
      
      const timeUntilDelete = deleteTime.getTime() - now.getTime();
      
      console.log(`Channels will be deleted at ${deleteTime.toLocaleString()}`);
      
      // Schedule deletion
      setTimeout(async () => {
        try {
          await textChannel.delete();
          console.log(`Deleted text channel: ${textChannel.name}`);
        } catch (error) {
          console.error(`Failed to delete text channel: ${textChannel.name}`, error);
        }
        
        try {
          await voiceChannel.delete();
          console.log(`Deleted voice channel: ${voiceChannel.name}`);
        } catch (error) {
          console.error(`Failed to delete voice channel: ${voiceChannel.name}`, error);
        }
      }, timeUntilDelete);

      // Get all members in the server
      const members = guild.members.cache.filter(member => !member.user.bot);
      
      console.log(`Found ${members.size} members to move`);

      // Move members to the new voice channel
      let movedCount = 0;
      let failedCount = 0;

      for (const [memberId, member] of members) {
        try {
          // Only move members who are currently in a voice channel
          if (member.voice.channel) {
            await member.voice.setChannel(voiceChannel);
            movedCount++;
            console.log(`Moved ${member.user.username} to ${voiceChannel.name}`);
          }
        } catch (error) {
          console.error(`Failed to move ${member.user.username}:`, error);
          failedCount++;
        }
      }

      // Create response message
      let responseMessage = `Cours "${matiere}" créé avec succès!\n\n`;
      responseMessage += `Salon textuel: <#${textChannel.id}>\n`;
      responseMessage += `Salon vocal: <#${voiceChannel.id}>\n\n`;
      
      if (movedCount > 0) {
        responseMessage += `**${movedCount}** membres déplacés vers le salon vocal.\n`;
      } else {
        responseMessage += `Aucun membre n'était dans un salon vocal pour être déplacé.\n`;
      }
      
      if (failedCount > 0) {
        responseMessage += `⚠️ **${failedCount}** membres n'ont pas pu être déplacés.\n`;
      }
      
      responseMessage += `\nLes salons seront supprimés automatiquement à 18h00.`;

      await interaction.reply({
        content: responseMessage,
        ephemeral: false,
      });

    } catch (error) {
      console.error("Error in startcours command:", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de la création du salon vocal.",
        ephemeral: true,
      });
    }
  },
}; 