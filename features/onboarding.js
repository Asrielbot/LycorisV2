// features/onboarding.js
export default async function onboarding(client, member) {
  const channel = await member.createDM();

  try {
    await channel.send(
      `👋 Bienvenue ${member.user.username} !\n\n` +
        `Quel est ton profil ? Réagis avec :\n` +
        `🎓 Étudiant\n🎮 Gamer\n💼 Pro`
    );

    const filter = (reaction) =>
      ["🎓", "🎮", "💼"].includes(reaction.emoji.name);
    const collector = channel.createMessageCollector({ time: 15000 });

    collector.on("collect", async (message) => {
      const emoji = message.content.trim();
      let roleName = "";

      if (emoji === "🎓") roleName = "Étudiant";
      else if (emoji === "🎮") roleName = "Gamer";
      else if (emoji === "💼") roleName = "Pro";
      else return;

      const role = member.guild.roles.cache.find((r) => r.name === roleName);
      if (role) await member.roles.add(role);

      await channel.send(`✅ Rôle **${roleName}** ajouté avec succès !`);
      collector.stop();
    });
  } catch (error) {
    console.error("❌ Erreur onboarding :", error);
  }
}
