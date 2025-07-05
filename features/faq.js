// features/faq.js

// FAQ simple : mappe des mots-clés à des réponses textuelles
/*
const faqMap = {
  horaire:
    "⏰ Les horaires sont flexibles mais dépendent de l'organisation du serveur.",
  rôle: "👥 Tu peux choisir ton rôle via le message d'accueil ou la commande /config.",
  bot: "🤖 Je suis Lycoris, le bot assistant de ce serveur !",
};

export default async function faqResponder(client, message) {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  for (const keyword of Object.keys(faqMap)) {
    if (content.includes(keyword)) {
      await message.reply(faqMap[keyword]);
      break;
    }
  }
}
*/


// database/faq.js
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  content: { type: String, required: true },
});

export default mongoose.model("FAQ", faqSchema);
