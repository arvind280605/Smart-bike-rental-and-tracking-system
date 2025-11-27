// fix-database.js - Run this to clean up your database
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://arvindd:arvind2803@cluster0.yt7z55m.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function fixDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    
    const db = client.db("smart_bike-rentals");
    
    // Step 1: Delete old rentals collection
    console.log("\n🗑️  Cleaning up old data...");
    try {
      await db.collection("rentals").drop();
      console.log("✅ Deleted old 'rentals' collection");
    } catch (err) {
      console.log("ℹ️  No rentals collection to delete");
    }
    
    // Step 2: Clear rides and payments for fresh start
    await db.collection("rides").deleteMany({});
    await db.collection("payments").deleteMany({});
    console.log("✅ Cleared rides and payments collections");
    
    // Step 3: Reset all bikes to available
    const bikesResult = await db.collection("bikes").updateMany(
      {},
      { $set: { IS_AVAILABLE: 1 } }
    );
    console.log(`✅ Reset ${bikesResult.modifiedCount} bikes to available`);
    
    // Step 4: Reset station bike counts
    await db.collection("stations").updateOne(
      { STATION_ID: 1 },
      { $set: { AVAILABLE_BIKES: 8 } }
    );
    await db.collection("stations").updateOne(
      { STATION_ID: 2 },
      { $set: { AVAILABLE_BIKES: 6 } }
    );
    await db.collection("stations").updateOne(
      { STATION_ID: 3 },
      { $set: { AVAILABLE_BIKES: 10 } }
    );
    await db.collection("stations").updateOne(
      { STATION_ID: 4 },
      { $set: { AVAILABLE_BIKES: 5 } }
    );
    await db.collection("stations").updateOne(
      { STATION_ID: 5 },
      { $set: { AVAILABLE_BIKES: 7 } }
    );
    console.log("✅ Reset station bike counts");
    
    console.log("\n📋 Current Collections:");
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log("\n✅ Database cleaned! Now you can:");
    console.log("   1. Restart your server: node server.js");
    console.log("   2. Login to your app");
    console.log("   3. Rent a bike");
    console.log("   4. Check MongoDB - you'll see new records in 'rides' collection");
    console.log("   5. End the ride");
    console.log("   6. Check MongoDB - you'll see new record in 'payments' collection");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

fixDatabase();