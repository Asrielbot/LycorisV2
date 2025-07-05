// features/dynamicChannels.js

export default async function handleVoiceStateUpdate(
  client,
  oldState,
  newState
) {
  const triggerChannelName = "🔊 créer salon"; // Nom du salon déclencheur
  const guild = newState.guild;

  // Si l’utilisateur rejoint un salon vocal nommé "🔊 créer salon"
  if (
    newState.channel &&
    newState.channel.name === triggerChannelName &&
    (!oldState.channel || oldState.channel.id !== newState.channel.id)
  ) {
    const user = newState.member.user;
    const newChannelName = `Salon de ${user.username}`;

    // Crée un nouveau salon vocal privé
    const channel = await guild.channels.create({
      name: newChannelName,
      type: 2, // GUILD_VOICE
      parent: newState.channel.parent, // même catégorie
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ["Connect"],
        },
        {
          id: user.id,
          allow: ["Connect", "ManageChannels"],
        },
      ],
    });

    // Déplace l’utilisateur dans le nouveau salon
    await newState.setChannel(channel);

    // Supprime le salon quand il est vide
    const interval = setInterval(async () => {
      const updated = guild.channels.cache.get(channel.id);
      if (!updated || updated.members.size === 0) {
        await channel.delete().catch(() => {});
        clearInterval(interval);
      }
    }, 60_000); // Vérifie toutes les 60s
  }
}
