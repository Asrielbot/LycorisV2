// database/mongo.js
import mongoose from "mongoose";

export async function connectToMongoDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connexion à MongoDB réussie");
  } catch (error) {
    console.error("❌ Échec de connexion MongoDB :", error);
    process.exit(1);
  }
}
