// features/onboarding.js

export default async function onboarding(client, member) {
  try {
    const welcomeChannel =
      member.guild.systemChannel ||
      member.guild.channels.cache.find(
        (c) => c.name.toLowerCase().includes("accueil") && c.isTextBased()
      );

    if (!welcomeChannel) return;

    const message = await welcomeChannel.send({
      content:
        `👋 Bienvenue ${member.user} !\n\n` +
        `Choisis ton profil en cliquant sur un emoji :\n` +
        `🎓 Étudiant\n🎮 Gamer\n💼 Pro`,
    });

    await message.react("🎓");
    await message.react("🎮");
    await message.react("💼");

    const filter = (reaction, user) =>
      ["🎓", "🎮", "💼"].includes(reaction.emoji.name) && user.id === member.id;

    const collector = message.createReactionCollector({
      filter,
      max: 1,
      time: 30000,
    });

    collector.on("collect", async (reaction) => {
      const emoji = reaction.emoji.name;
      const roleMap = {
        "🎓": "Étudiant",
        "🎮": "Gamer",
        "💼": "Pro",
      };

      const roleName = roleMap[emoji];
      const role = member.guild.roles.cache.find((r) => r.name === roleName);

      if (role) {
        await member.roles.add(role);
        await welcomeChannel.send(
          `✅ ${member.user} a reçu le rôle **${roleName}**.`
        );
      } else {
        await welcomeChannel.send(
          `⚠️ Le rôle **${roleName}** n'existe pas sur ce serveur.`
        );
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        welcomeChannel.send(`⏳ ${member.user}, tu n’as pas réagi à temps.`);
      }
    });
  } catch (error) {
    console.error("❌ Erreur onboarding :", error);
  }
}
