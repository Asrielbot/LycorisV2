// database/mongo.js
import mongoose from "mongoose";

export async function connectToMongoDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection successful");
    
    // Get the database instance
    const db = mongoose.connection.db;
    
    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const databases = await adminDb.listDatabases();
    console.log("Available databases:");
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // List all collections in the current database
    const collections = await db.listCollections().toArray();
    console.log(`Collections in current database (${db.databaseName}):`);
    collections.forEach(collection => {
      console.log(`  - ${collection.name} (${collection.type})`);
    });
    
    // Check if EDT collection exists and show sample data
    const edtCollection = db.collection('EDT');
    const edtCount = await edtCollection.countDocuments();
    console.log(`EDT collection document count: ${edtCount}`);
    
    if (edtCount > 0) {
      const sampleDocs = await edtCollection.find({}).limit(3).toArray();
      console.log("Sample EDT documents:");
      sampleDocs.forEach((doc, index) => {
        console.log(`  ${index + 1}. Week: "${doc.Week}", Position: "${doc.Position}", Text: "${doc.Text}"`);
      });
    }
    
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
