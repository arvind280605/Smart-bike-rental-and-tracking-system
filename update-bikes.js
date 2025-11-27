// update-bikes-backend.js - Updates existing bikes with real names
// Usage: node update-bikes-backend.js

const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://arvindd:arvind2803@cluster0.yt7z55m.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function updateBikesBackend() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    
    const db = client.db("smart_bike-rentals");
    const bikesCollection = db.collection("bikes");
    
    console.log('\n🔄 Updating bikes with real Indian bike models...\n');
    
    // Your existing bikes with their _id values
    const bikesToUpdate = [
      {
        _id: new ObjectId("68e65db3822e02c3bbc3202a"),
        BIKE_ID: 1,
        STATION_ID: 1,
        MODEL: "Honda Activa 6G",
        IS_AVAILABLE: 1,
        TYPE: "Scooter"
      },
      {
        _id: new ObjectId("68e65db3822e02c3bbc3202b"),
        BIKE_ID: 2,
        STATION_ID: 3,
        MODEL: "Hero Splendor Plus",
        IS_AVAILABLE: 1,
        TYPE: "Motorcycle"
      },
      {
        _id: new ObjectId("68e65db3822e02c3bbc3202c"),
        BIKE_ID: 3,
        STATION_ID: 2,
        MODEL: "TVS Jupiter",
        IS_AVAILABLE: 1,
        TYPE: "Scooter"
      },
      {
        _id: new ObjectId("68e65db3822e02c3bbc3202d"),
        BIKE_ID: 4,
        STATION_ID: 5,
        MODEL: "Bajaj Pulsar 150",
        IS_AVAILABLE: 1,
        TYPE: "Motorcycle"
      },
      {
        _id: new ObjectId("68e65db3822e02c3bbc3202e"),
        BIKE_ID: 5,
        STATION_ID: 3,
        MODEL: "Suzuki Access 125",
        IS_AVAILABLE: 1,
        TYPE: "Scooter"
      }
    ];
    
    // Update each bike
    for (const bike of bikesToUpdate) {
      const result = await bikesCollection.updateOne(
        { _id: bike._id },
        { 
          $set: {
            BIKE_ID: bike.BIKE_ID,
            STATION_ID: bike.STATION_ID,
            MODEL: bike.MODEL,
            IS_AVAILABLE: bike.IS_AVAILABLE,
            TYPE: bike.TYPE
          },
          $unset: {
            REAL_NAME: "" // Remove the old REAL_NAME field
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated Bike ${bike.BIKE_ID}: ${bike.MODEL} (Station ${bike.STATION_ID})`);
      } else {
        console.log(`⚠️  Bike ${bike.BIKE_ID} not found or already updated`);
      }
    }
    
    console.log('\n✅ All bikes updated successfully!');
    
    // Display updated bikes
    console.log('\n📋 Current Bikes in Database:');
    console.log('='.repeat(70));
    
    const allBikes = await bikesCollection.find({}).sort({ BIKE_ID: 1 }).toArray();
    allBikes.forEach(bike => {
      console.log(`\n🚲 Bike ID: ${bike.BIKE_ID}`);
      console.log(`   Model: ${bike.MODEL}`);
      console.log(`   Type: ${bike.TYPE}`);
      console.log(`   Station: ${bike.STATION_ID}`);
      console.log(`   Available: ${bike.IS_AVAILABLE ? 'Yes' : 'No'}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log(`\n📊 Total Bikes: ${allBikes.length}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n✅ Done! Your bikes have been updated.");
  }
}

updateBikesBackend();