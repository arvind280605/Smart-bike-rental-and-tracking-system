const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://arvindd:arvind2803@cluster0.yt7z55m.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    const db = client.db("SmartBikeRental");
    const users = db.collection("users");
    const count = await users.countDocuments();
    console.log("Users count:", count);
    await client.close();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

test();
