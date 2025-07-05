// features/onboarding.js

export default async function onboarding(client, member) {
  try {
    const dm = await member.createDM();

    const message = await dm.send(
      `👋 Bienvenue ${member.user.username} !\n\n` +
        `Choisis ton profil en cliquant sur un emoji :\n` +
        `🎓 Étudiant\n🎮 Gamer\n💼 Pro`
    );

    // Ajoute les réactions
    await message.react("🎓");
    await message.react("🎮");
    await message.react("💼");

    // Filtre sur les emojis et l'auteur
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
        await dm.send(
          `✅ Le rôle **${roleName}** t'a été attribué avec succès.`
        );
      } else {
        await dm.send(
          `⚠️ Le rôle **${roleName}** n'existe pas sur ce serveur.`
        );
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        dm.send("⏳ Tu n’as pas réagi à temps. Tu peux réessayer plus tard.");
      }
    });
  } catch (error) {
    console.error("❌ Erreur dans l’onboarding :", error);
  }
}
