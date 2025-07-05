// features/notes.js

export default async function createPrivateNotesChannel(client, member) {
  const guild = member.guild;
  const channelName = `notes-${member.user.username.toLowerCase()}`;

  // Vérifie si le salon existe déjà
  const existing = guild.channels.cache.find(
    (c) => c.name === channelName && c.type === 0 // Type 0 = GUILD_TEXT
  );
  if (existing) return;

  try {
    const channel = await guild.channels.create({
      name: channelName,
      type: 0, // GUILD_TEXT
      topic: `Salon privé de notes pour ${member.user.username}`,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ["ViewChannel"],
        },
        {
          id: member.user.id,
          allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
        },
      ],
    });

    await channel.send(
      `📝 Bienvenue dans ton espace personnel, ${member.user.username} !`
    );
  } catch (error) {
    console.error(`❌ Erreur lors de la création du salon de notes :`, error);
  }
}
