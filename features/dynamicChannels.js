// features/dynamicChannels.js

export default async function handleDynamicChannels(
  client,
  oldState,
  newState
) {
  // Crée un salon dynamique si un utilisateur rejoint un salon vocal de base
  if (newState.channel !== null && !newState.channel.name.includes(" - ")) {
    const newChannel = await newState.channel.clone({
      name: `${newState.channel.name} - ${
        newState.member.nickname || newState.member.user.displayName
      }`,
    });
    await newState.member.voice.setChannel(newChannel);
  }

  // Supprime un salon dynamique s'il est vide
  if (
    oldState.channel !== null &&
    oldState.channel.members.size === 0 &&
    oldState.channel.name.includes(" - ")
  ) {
    await oldState.channel.delete();
  }
}
