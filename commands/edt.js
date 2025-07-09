// commands/edt.js
import { SlashCommandBuilder } from "discord.js";
import EDT from "../database/models/EDT.js";

export default {
  data: new SlashCommandBuilder()
    .setName("edt")
    .setDescription("Affiche les cours pour une date donnée")
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Date au format dd/mm/yyyy")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const date = interaction.options.getString("date");
      
      // Debug: Check if EDT model is working
      console.log(`EDT model:`, EDT);
      console.log(`EDT collection name:`, EDT.collection.name);
      
      // Validate date format (dd/mm/yyyy)
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(date)) {
        await interaction.reply({
          content: "❌ Format de date invalide. Utilisez le format dd/mm/yyyy (ex: 25/12/2024)",
          ephemeral: true,
        });
        return;
      }

      // Convert the input date to the Wednesday of that week
      function getWednesdayOfWeek(dateString) {
        // Parse the date (dd/mm/yyyy format)
        const [day, month, year] = dateString.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed
        
        // Get the day of the week (0 = Sunday, 1 = Monday, ..., 3 = Wednesday)
        const dayOfWeek = inputDate.getDay();
        
        // Calculate days to add to get to Wednesday
        // If it's Sunday (0), we add 3 days to get to Wednesday (3)
        // If it's Monday (1), we add 2 days to get to Wednesday (3)
        // If it's Tuesday (2), we add 1 day to get to Wednesday (3)
        // If it's Wednesday (3), we add 0 days
        // If it's Thursday (4), we subtract 1 day to get to Wednesday (3)
        // If it's Friday (5), we subtract 2 days to get to Wednesday (3)
        // If it's Saturday (6), we subtract 3 days to get to Wednesday (3)
        let daysToAdd;
        if (dayOfWeek <= 3) {
          daysToAdd = 3 - dayOfWeek; // Wednesday is day 3
        } else {
          daysToAdd = 3 - dayOfWeek; // This will be negative for Thursday-Saturday
        }
        
        const wednesdayDate = new Date(inputDate);
        wednesdayDate.setDate(inputDate.getDate() + daysToAdd);
        
        // Format back to dd/mm/yyyy
        const wednesdayDay = String(wednesdayDate.getDate()).padStart(2, '0');
        const wednesdayMonth = String(wednesdayDate.getMonth() + 1).padStart(2, '0');
        const wednesdayYear = wednesdayDate.getFullYear();
        
        return `${wednesdayDay}/${wednesdayMonth}/${wednesdayYear}`;
      }

      const wednesdayDate = getWednesdayOfWeek(date);
      console.log(`Original date: ${date} -> Wednesday of that week: ${wednesdayDate}`);

      // Debug: Let's see what's in the database
      console.log(`Searching for Wednesday date: "${wednesdayDate}"`);
      console.log(`Wednesday date type:`, typeof wednesdayDate);
      console.log(`Wednesday date length:`, wednesdayDate.length);
      
      // First, let's see what's actually in the database
      const allEntries = await EDT.find({}).limit(10);
      console.log(`Total entries in database:`, allEntries.length);
      console.log(`Sample database entries:`, allEntries.map(e => ({ 
        Week: e.Week, 
        WeekType: typeof e.Week,
        WeekLength: e.Week ? e.Week.length : 'null',
        Position: e.Position 
      })));
      
      // Find entries in EDT collection where Week matches the Wednesday date
      const entries = await EDT.find({ Week: wednesdayDate });
      
      console.log(`Found ${entries.length} entries for exact match`);
      console.log(`Sample found entries:`, entries.slice(0, 3));

      if (entries.length === 0) {
        // Try a more flexible search
        console.log(`Trying flexible search...`);
        const flexibleEntries = await EDT.find({ Week: { $regex: wednesdayDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } });
        console.log(`Found ${flexibleEntries.length} entries with flexible search`);
        
        await interaction.reply({
          content: `Aucun cours trouvé pour la semaine du ${date}`,
          ephemeral: false,
        });
        return;
      }

      // Extract Position and Text values and format them
      const texts = entries.map(entry => `**${entry.Position} :** ${entry.Text}`).join('\n');

      await interaction.reply({
        content: `Cours pour la semaine du ${date} :\n\n${texts}`,
        ephemeral: false,
      });

    } catch (error) {
      console.error("Erreur dans la commande edt:", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de la récupération des cours.",
        ephemeral: true,
      });
    }
  },
}; 