// update-stations.js - Run this ONCE to update your stations and bikes
// Usage: node update-stations.js

const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://arvindd:arvind2803@cluster0.yt7z55m.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function updateStationsAndBikes() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    
    const db = client.db("smart_bike-rentals");
    const stationsCollection = db.collection("stations");
    const bikesCollection = db.collection("bikes");
    
    // Step 1: Delete ALL old stations
    const deleteStationsResult = await stationsCollection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteStationsResult.deletedCount} old stations`);
    
    // Step 2: Delete ALL old bikes
    const deleteBikesResult = await bikesCollection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteBikesResult.deletedCount} old bikes`);
    
    // Step 3: Create 5 NEW stations (only with AVAILABLE_BIKES)
    console.log('\n📍 Creating new stations...');
    
    const newStations = [
      {
        STATION_ID: 1,
        NAME: "Chennai Central Station",
        LOCATION: "Park Town, Chennai, Tamil Nadu - 600003",
        CITY: "Chennai",
        AVAILABLE_BIKES: 8
      },
      {
        STATION_ID: 2,
        NAME: "Coimbatore RS Puram",
        LOCATION: "RS Puram, Coimbatore, Tamil Nadu - 641002",
        CITY: "Coimbatore",
        AVAILABLE_BIKES: 6
      },
      {
        STATION_ID: 3,
        NAME: "Madurai Meenakshi Station",
        LOCATION: "Near Meenakshi Temple, Madurai, Tamil Nadu - 625001",
        CITY: "Madurai",
        AVAILABLE_BIKES: 10
      },
      {
        STATION_ID: 4,
        NAME: "Kochi Marine Drive",
        LOCATION: "Marine Drive, Ernakulam, Kochi, Kerala - 682031",
        CITY: "Kochi",
        AVAILABLE_BIKES: 5
      },
      {
        STATION_ID: 5,
        NAME: "Thiruvananthapuram Fort",
        LOCATION: "Fort Area, Thiruvananthapuram, Kerala - 695023",
        CITY: "Thiruvananthapuram",
        AVAILABLE_BIKES: 7
      }
    ];
    
    const stationsResult = await stationsCollection.insertMany(newStations);
    console.log(`✅ Created ${stationsResult.insertedCount} new stations!`);
    
    // Step 4: Add real bikes with authentic Indian models
    console.log('\n🚲 Adding bikes...');
    
    const realBikes = [
      // Chennai Central Station (Station 1) - 15 bikes (8 available, 7 rented)
      { BIKE_ID: 1, MODEL: "Honda Activa 6G", TYPE: "Scooter", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 2, MODEL: "TVS Jupiter", TYPE: "Scooter", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 3, MODEL: "Hero Splendor Plus", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 4, MODEL: "Bajaj Pulsar 150", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 0 },
      { BIKE_ID: 5, MODEL: "Suzuki Access 125", TYPE: "Scooter", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 6, MODEL: "Yamaha FZ-S", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 7, MODEL: "Honda Dio", TYPE: "Scooter", STATION_ID: 1, IS_AVAILABLE: 0 },
      { BIKE_ID: 8, MODEL: "Royal Enfield Classic 350", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 9, MODEL: "TVS Apache RTR 160", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 0 },
      { BIKE_ID: 10, MODEL: "Hero Passion Pro", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 11, MODEL: "Bajaj Avenger 220", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 0 },
      { BIKE_ID: 12, MODEL: "Yamaha Ray ZR", TYPE: "Scooter", STATION_ID: 1, IS_AVAILABLE: 1 },
      { BIKE_ID: 13, MODEL: "Honda Shine", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 0 },
      { BIKE_ID: 14, MODEL: "TVS NTorq 125", TYPE: "Scooter", STATION_ID: 1, IS_AVAILABLE: 0 },
      { BIKE_ID: 15, MODEL: "Suzuki Gixxer", TYPE: "Motorcycle", STATION_ID: 1, IS_AVAILABLE: 0 },

      // Coimbatore RS Puram (Station 2) - 12 bikes (6 available, 6 rented)
      { BIKE_ID: 16, MODEL: "Honda Activa 6G", TYPE: "Scooter", STATION_ID: 2, IS_AVAILABLE: 1 },
      { BIKE_ID: 17, MODEL: "Royal Enfield Meteor 350", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 1 },
      { BIKE_ID: 18, MODEL: "Bajaj Pulsar NS200", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 0 },
      { BIKE_ID: 19, MODEL: "TVS Jupiter", TYPE: "Scooter", STATION_ID: 2, IS_AVAILABLE: 1 },
      { BIKE_ID: 20, MODEL: "Hero Splendor Plus", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 0 },
      { BIKE_ID: 21, MODEL: "Yamaha MT-15", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 1 },
      { BIKE_ID: 22, MODEL: "Suzuki Access 125", TYPE: "Scooter", STATION_ID: 2, IS_AVAILABLE: 0 },
      { BIKE_ID: 23, MODEL: "KTM Duke 200", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 1 },
      { BIKE_ID: 24, MODEL: "Honda CB Shine", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 0 },
      { BIKE_ID: 25, MODEL: "TVS Apache RR 310", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 1 },
      { BIKE_ID: 26, MODEL: "Hero Glamour", TYPE: "Motorcycle", STATION_ID: 2, IS_AVAILABLE: 0 },
      { BIKE_ID: 27, MODEL: "Honda Dio", TYPE: "Scooter", STATION_ID: 2, IS_AVAILABLE: 0 },

      // Madurai Meenakshi Station (Station 3) - 15 bikes (10 available, 5 rented)
      { BIKE_ID: 28, MODEL: "Bajaj Pulsar 150", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 29, MODEL: "TVS Jupiter", TYPE: "Scooter", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 30, MODEL: "Hero Splendor Plus", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 31, MODEL: "Honda Activa 6G", TYPE: "Scooter", STATION_ID: 3, IS_AVAILABLE: 0 },
      { BIKE_ID: 32, MODEL: "Yamaha FZ", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 33, MODEL: "Royal Enfield Bullet 350", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 34, MODEL: "Suzuki Gixxer SF", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 0 },
      { BIKE_ID: 35, MODEL: "TVS NTorq 125", TYPE: "Scooter", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 36, MODEL: "Hero Xtreme 160R", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 37, MODEL: "Bajaj Avenger Street 160", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 0 },
      { BIKE_ID: 38, MODEL: "Honda Grazia", TYPE: "Scooter", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 39, MODEL: "TVS Apache RTR 200", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 40, MODEL: "Yamaha Fascino", TYPE: "Scooter", STATION_ID: 3, IS_AVAILABLE: 0 },
      { BIKE_ID: 41, MODEL: "Hero HF Deluxe", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 1 },
      { BIKE_ID: 42, MODEL: "Bajaj CT 110", TYPE: "Motorcycle", STATION_ID: 3, IS_AVAILABLE: 0 },

      // Kochi Marine Drive (Station 4) - 10 bikes (5 available, 5 rented)
      { BIKE_ID: 43, MODEL: "Honda Activa 6G", TYPE: "Scooter", STATION_ID: 4, IS_AVAILABLE: 1 },
      { BIKE_ID: 44, MODEL: "TVS Apache RTR 160", TYPE: "Motorcycle", STATION_ID: 4, IS_AVAILABLE: 1 },
      { BIKE_ID: 45, MODEL: "Hero Splendor Plus", TYPE: "Motorcycle", STATION_ID: 4, IS_AVAILABLE: 0 },
      { BIKE_ID: 46, MODEL: "Suzuki Access 125", TYPE: "Scooter", STATION_ID: 4, IS_AVAILABLE: 1 },
      { BIKE_ID: 47, MODEL: "Yamaha R15 V4", TYPE: "Motorcycle", STATION_ID: 4, IS_AVAILABLE: 0 },
      { BIKE_ID: 48, MODEL: "Bajaj Dominar 400", TYPE: "Motorcycle", STATION_ID: 4, IS_AVAILABLE: 1 },
      { BIKE_ID: 49, MODEL: "TVS Jupiter", TYPE: "Scooter", STATION_ID: 4, IS_AVAILABLE: 0 },
      { BIKE_ID: 50, MODEL: "Royal Enfield Himalayan", TYPE: "Motorcycle", STATION_ID: 4, IS_AVAILABLE: 1 },
      { BIKE_ID: 51, MODEL: "Honda CB Hornet", TYPE: "Motorcycle", STATION_ID: 4, IS_AVAILABLE: 0 },
      { BIKE_ID: 52, MODEL: "Yamaha FZ25", TYPE: "Motorcycle", STATION_ID: 4, IS_AVAILABLE: 0 },

      // Thiruvananthapuram Fort (Station 5) - 12 bikes (7 available, 5 rented)
      { BIKE_ID: 53, MODEL: "Honda Activa 6G", TYPE: "Scooter", STATION_ID: 5, IS_AVAILABLE: 1 },
      { BIKE_ID: 54, MODEL: "TVS Jupiter", TYPE: "Scooter", STATION_ID: 5, IS_AVAILABLE: 1 },
      { BIKE_ID: 55, MODEL: "Bajaj Pulsar 150", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 0 },
      { BIKE_ID: 56, MODEL: "Hero Splendor Plus", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 1 },
      { BIKE_ID: 57, MODEL: "Royal Enfield Classic 350", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 1 },
      { BIKE_ID: 58, MODEL: "Suzuki Gixxer", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 0 },
      { BIKE_ID: 59, MODEL: "Yamaha FZ-S", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 1 },
      { BIKE_ID: 60, MODEL: "TVS NTorq 125", TYPE: "Scooter", STATION_ID: 5, IS_AVAILABLE: 0 },
      { BIKE_ID: 61, MODEL: "Honda Dio", TYPE: "Scooter", STATION_ID: 5, IS_AVAILABLE: 1 },
      { BIKE_ID: 62, MODEL: "Bajaj Avenger 220", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 0 },
      { BIKE_ID: 63, MODEL: "Hero Xtreme 160R", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 1 },
      { BIKE_ID: 64, MODEL: "KTM RC 200", TYPE: "Motorcycle", STATION_ID: 5, IS_AVAILABLE: 0 }
    ];
    
    const bikesResult = await bikesCollection.insertMany(realBikes);
    console.log(`✅ Added ${bikesResult.insertedCount} bikes!`);
    
    // Step 5: Display summary
    console.log("\n📋 Database Summary:");
    console.log("=".repeat(70));
    
    const allStations = await stationsCollection.find({}).sort({ STATION_ID: 1 }).toArray();
    allStations.forEach(station => {
      console.log(`\n📍 ${station.NAME}`);
      console.log(`   📌 Location: ${station.LOCATION}`);
      console.log(`   🚲 Available Bikes: ${station.AVAILABLE_BIKES}`);
    });
    
    console.log("\n" + "=".repeat(70));
    console.log(`\n📊 Overall Statistics:`);
    console.log(`   Total Bikes in System: ${realBikes.length}`);
    console.log(`   Currently Available: ${realBikes.filter(b => b.IS_AVAILABLE === 1).length}`);
    console.log(`   Currently Rented: ${realBikes.filter(b => b.IS_AVAILABLE === 0).length}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n✅ Done! Refresh your application now.");
  }
}

updateStationsAndBikes();