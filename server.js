const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const bcrypt = require('bcrypt'); // For password hashing - run: npm install bcrypt

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.use(express.json());
app.use(express.static(__dirname)); // serve HTML files

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    
    const db = client.db("smart_bike-rentals");
    
    // Collections
    const usersCollection = db.collection("users");
    const bikesCollection = db.collection("bikes");
    const stationsCollection = db.collection("stations");
    const ridesCollection = db.collection("rides");
    const paymentsCollection = db.collection("payments");

    // ==================== HTML ROUTES ====================
    
    // Serve login page as default
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "login.html"));
    });

    // Serve register page
    app.get("/register-page", (req, res) => {
      res.sendFile(path.join(__dirname, "register.html"));
    });

    // Serve bikerental page (if different from register)
    app.get("/bikerental", (req, res) => {
      res.sendFile(path.join(__dirname, "bikerental.html"));
    });

    app.get("/dashboard", (req, res) => {
      res.sendFile(path.join(__dirname, "dashboard.html"));
    });

    // ==================== AUTH ROUTES ====================
    
    // User Registration
    app.post("/register", async (req, res) => {
      try {
        const { userId, name, email, phone, password, bikeId, duration } = req.body;

        // Check if user already exists
        const existingUser = await usersCollection.findOne({
          $or: [
            { USER_ID: parseInt(userId) },
            { EMAIL: email }
          ]
        });

        if (existingUser) {
          return res.status(400).json({ 
            success: false, 
            message: "User ID or Email already exists!" 
          });
        }

        // Hash password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
          USER_ID: parseInt(userId),
          NAME: name,
          EMAIL: email,
          PHONE: phone,
          PASSWORD: hashedPassword,
          DATE_REGISTERED: new Date(),
          STATUS: "Active",
          TOTAL_RIDES: 0,
          TOTAL_HOURS: 0,
          TOTAL_SPENT: 0
        };

        const result = await usersCollection.insertOne(user);
        console.log("✅ User registered successfully:", result.insertedId);

        res.json({ 
          success: true, 
          message: "User registered successfully! Please login to continue." 
        });

      } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ 
          success: false, 
          message: "Error registering user: " + err.message 
        });
      }
    });

    // User Login
    app.post("/login", async (req, res) => {
      try {
        const { loginId, password } = req.body;

        // Find user by email or user ID
        const user = await usersCollection.findOne({
          $or: [
            { EMAIL: loginId },
            { USER_ID: parseInt(loginId) || 0 }
          ]
        });

        if (!user) {
          return res.status(400).json({
            success: false,
            message: "User not found!"
          });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.PASSWORD);
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: "Invalid password!"
          });
        }

        // Return user data (without password)
        const userData = {
          userId: user.USER_ID,
          name: user.NAME,
          email: user.EMAIL,
          phone: user.PHONE,
          status: user.STATUS,
          dateRegistered: user.DATE_REGISTERED
        };

        res.json({
          success: true,
          message: "Login successful!",
          user: userData
        });

      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
          success: false,
          message: "Error during login: " + err.message
        });
      }
    });

    // ==================== API ROUTES ====================

    // Get user statistics
    app.get("/api/user-stats/:userId", async (req, res) => {
      try {
        const userId = parseInt(req.params.userId);
        
        // Get user info
        const user = await usersCollection.findOne({ USER_ID: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Get ride statistics
        const rides = await ridesCollection.find({ USER_ID: userId }).toArray();
        const completedRides = rides.filter(ride => ride.STATUS === "Completed");
        
        const totalRides = rides.length;
        const totalHours = rides.reduce((sum, ride) => sum + (ride.DURATION_HRS || 0), 0);
        const totalSpent = rides.reduce((sum, ride) => sum + (ride.AMOUNT || 0), 0);

        res.json({
          totalRides,
          totalHours,
          totalSpent,
          activeRides: rides.filter(ride => ride.STATUS === "Ongoing").length
        });

      } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ message: "Error fetching stats" });
      }
    });

    // Get recent activity
    app.get("/api/recent-activity/:userId", async (req, res) => {
      try {
        const userId = parseInt(req.params.userId);
        
        const recentRides = await ridesCollection
          .find({ USER_ID: userId })
          .sort({ START_TIME: -1 })
          .limit(5)
          .toArray();

        const activities = recentRides.map(ride => ({
          type: "Bike Ride",
          description: `Rode Bike #${ride.BIKE_ID} for ${ride.DURATION_HRS} hours`,
          date: ride.START_TIME,
          status: ride.STATUS.toLowerCase()
        }));

        res.json(activities);

      } catch (err) {
        console.error("Recent activity error:", err);
        res.status(500).json({ message: "Error fetching recent activity" });
      }
    });

    // Get available bikes
    app.get("/api/bikes", async (req, res) => {
      try {
        // Fetch bikes from YOUR existing collection
        const bikes = await bikesCollection.find({}).toArray();
        console.log(`Fetched ${bikes.length} bikes from database`);
        
        // Log first bike to see structure
        if (bikes.length > 0) {
          console.log("Sample bike:", bikes[0]);
        }
        
        res.json(bikes);

      } catch (err) {
        console.error("Bikes error:", err);
        res.status(500).json({ message: "Error fetching bikes", error: err.message });
      }
    });

    // Get stations
    app.get("/api/stations", async (req, res) => {
      try {
        // Check if stations collection exists and has data
        const stationCount = await stationsCollection.countDocuments();
        
        if (stationCount === 0 || stationCount < 5) {
          console.log("Creating/Updating stations with proper addresses...");
          
          // Delete old stations
          await stationsCollection.deleteMany({});
          
          // Create 5 new stations with proper addresses
          const sampleStations = [
            { 
              STATION_ID: 1, 
              NAME: "Chennai Central Station", 
              ADDRESS: "Park Town, Chennai, Tamil Nadu - 600003", 
              CITY: "Chennai",
              AVAILABLE_BIKES: 8,
              TOTAL_CAPACITY: 15
            },
            { 
              STATION_ID: 2, 
              NAME: "Coimbatore RS Puram", 
              ADDRESS: "RS Puram, Coimbatore, Tamil Nadu - 641002", 
              CITY: "Coimbatore",
              AVAILABLE_BIKES: 6,
              TOTAL_CAPACITY: 12
            },
            { 
              STATION_ID: 3, 
              NAME: "Madurai Meenakshi Station", 
              ADDRESS: "Near Meenakshi Temple, Madurai, Tamil Nadu - 625001", 
              CITY: "Madurai",
              AVAILABLE_BIKES: 10,
              TOTAL_CAPACITY: 15
            },
            { 
              STATION_ID: 4, 
              NAME: "Kochi Marine Drive", 
              ADDRESS: "Marine Drive, Ernakulam, Kochi, Kerala - 682031", 
              CITY: "Kochi",
              AVAILABLE_BIKES: 5,
              TOTAL_CAPACITY: 10
            },
            { 
              STATION_ID: 5, 
              NAME: "Thiruvananthapuram Fort", 
              ADDRESS: "Fort Area, Thiruvananthapuram, Kerala - 695023", 
              CITY: "Thiruvananthapuram",
              AVAILABLE_BIKES: 7,
              TOTAL_CAPACITY: 12
            }
          ];
          await stationsCollection.insertMany(sampleStations);
          console.log("✅ Created 5 stations with addresses");
        }

        let stations = await stationsCollection.find({}).toArray();
        
        // Fix any negative available bikes
        for (let station of stations) {
          if (station.AVAILABLE_BIKES < 0) {
            await stationsCollection.updateOne(
              { STATION_ID: station.STATION_ID },
              { $set: { AVAILABLE_BIKES: 0 } }
            );
            station.AVAILABLE_BIKES = 0;
          }
        }
        
        console.log(`✅ Fetched ${stations.length} stations`);
        res.json(stations);

      } catch (err) {
        console.error("❌ Stations error:", err);
        res.status(500).json({ message: "Error fetching stations" });
      }
    });

    // Get user rides
    app.get("/api/rides/:userId", async (req, res) => {
      try {
        const userId = parseInt(req.params.userId);
        const rides = await ridesCollection
          .find({ USER_ID: userId })
          .sort({ START_TIME: -1 })
          .toArray();

        res.json(rides);

      } catch (err) {
        console.error("Rides error:", err);
        res.status(500).json({ message: "Error fetching rides" });
      }
    });

    // Create new ride
    app.post("/api/rent-bike", async (req, res) => {
      try {
        const { userId, bikeId, duration, stationId } = req.body;

        console.log(`🚲 Rent bike request: User ${userId}, Bike ${bikeId}, Station ${stationId}, Duration ${duration}hrs`);

        // Check if bike is available using YOUR database field names
        const bike = await bikesCollection.findOne({ BIKE_ID: parseInt(bikeId) });
        if (!bike) {
          console.log(`❌ Bike ${bikeId} not found`);
          return res.status(400).json({
            success: false,
            message: "Bike not found!"
          });
        }
        
        if (bike.IS_AVAILABLE !== 1 && bike.IS_AVAILABLE !== true) {
          console.log(`❌ Bike ${bikeId} not available`);
          return res.status(400).json({
            success: false,
            message: "Bike not available!"
          });
        }

        // Create new ride with all details
        const newRide = {
          USER_ID: parseInt(userId),
          BIKE_ID: parseInt(bikeId),
          STATION_ID: parseInt(stationId),
          START_TIME: new Date(),
          DURATION_HRS: parseInt(duration),
          STATUS: "Ongoing",
          AMOUNT: parseInt(duration) * 10, // ₹10 per hour
          END_TIME: null,
          ACTUAL_DURATION: null,
          FINAL_AMOUNT: null
        };

        const result = await ridesCollection.insertOne(newRide);
        console.log(`✅ Ride created:`, result.insertedId);

        // Update bike availability
        await bikesCollection.updateOne(
          { BIKE_ID: parseInt(bikeId) },
          { $set: { IS_AVAILABLE: 0 } }
        );
        console.log(`✅ Bike ${bikeId} marked as rented`);

        // Update station available bikes if stations exist
        try {
          const updateResult = await stationsCollection.updateOne(
            { STATION_ID: parseInt(stationId) },
            { $inc: { AVAILABLE_BIKES: -1 } }
          );
          if (updateResult.modifiedCount > 0) {
            console.log(`✅ Station ${stationId} bikes decreased`);
          }
        } catch (err) {
          console.log("⚠️ Station update skipped:", err.message);
        }

        res.json({
          success: true,
          message: "Bike rented successfully!",
          rideId: result.insertedId
        });

      } catch (err) {
        console.error("❌ Rent bike error:", err);
        res.status(500).json({
          success: false,
          message: "Error renting bike: " + err.message
        });
      }
    });

    // End ride
    app.post("/api/end-ride", async (req, res) => {
      try {
        const { rideId, stationId } = req.body;

        const ride = await ridesCollection.findOne({ _id: new ObjectId(rideId) });
        if (!ride) {
          return res.status(404).json({
            success: false,
            message: "Ride not found!"
          });
        }

        // Calculate exact time ridden
        const endTime = new Date();
        const startTime = new Date(ride.START_TIME);
        
        // Calculate difference in minutes
        const totalMinutes = Math.ceil((endTime - startTime) / (1000 * 60));
        
        // Calculate amount: ₹10 per hour = ₹0.1667 per minute (rounded to 2 decimals)
        // OR: Calculate hourly rate proportionally
        const actualHours = totalMinutes / 60; // Convert minutes to hours (decimal)
        const finalAmount = Math.round(actualHours * 10); // ₹10 per hour
        
        console.log(`⏱️  Ride Duration: ${totalMinutes} minutes (${actualHours.toFixed(2)} hours)`);
        console.log(`💰 Amount: ₹${finalAmount}`);

        // Update ride status
        await ridesCollection.updateOne(
          { _id: new ObjectId(rideId) },
          { 
            $set: { 
              STATUS: "Completed",
              END_TIME: endTime,
              ACTUAL_MINUTES: totalMinutes,
              ACTUAL_DURATION: parseFloat(actualHours.toFixed(2)),
              FINAL_AMOUNT: finalAmount
            } 
          }
        );

        // CREATE PAYMENT RECORD
        const paymentCount = await paymentsCollection.countDocuments();
        const newPayment = {
          PAYMENT_ID: paymentCount + 1,
          RIDE_ID: rideId,
          USER_ID: ride.USER_ID,
          AMOUNT: finalAmount,
          PAYMENT_METHOD: "Online",
          STATUS: "Completed",
          PAYMENT_DATE: endTime,
          BIKE_ID: ride.BIKE_ID,
          DURATION_MINUTES: totalMinutes,
          DURATION_HOURS: parseFloat(actualHours.toFixed(2))
        };
        
        await paymentsCollection.insertOne(newPayment);
        console.log(`✅ Payment record created: ₹${finalAmount} for ${totalMinutes} minutes`);

        // UPDATE USER STATISTICS
        await usersCollection.updateOne(
          { USER_ID: ride.USER_ID },
          { 
            $inc: { 
              TOTAL_RIDES: 1,
              TOTAL_HOURS: parseFloat(actualHours.toFixed(2)),
              TOTAL_SPENT: finalAmount
            } 
          }
        );
        console.log(`✅ Updated user statistics for User ${ride.USER_ID}`);

        // Update bike availability
        await bikesCollection.updateOne(
          { BIKE_ID: ride.BIKE_ID },
          { $set: { IS_AVAILABLE: 1, STATION_ID: parseInt(stationId) } }
        );

        // Update station available bikes
        await stationsCollection.updateOne(
          { STATION_ID: parseInt(stationId) },
          { $inc: { AVAILABLE_BIKES: 1 } }
        ).catch(err => console.log("⚠️  Station update skipped:", err.message));

        res.json({
          success: true,
          message: `Ride completed! Duration: ${totalMinutes} minutes`,
          finalAmount,
          duration: totalMinutes
        });

      } catch (err) {
        console.error("❌ End ride error:", err);
        res.status(500).json({
          success: false,
          message: "Error ending ride: " + err.message
        });
      }
    });

    // Get payments
    app.get("/api/payments/:userId", async (req, res) => {
      try {
        const userId = parseInt(req.params.userId);
        
        // Get payments from payments collection
        const payments = await paymentsCollection
          .find({ USER_ID: userId })
          .sort({ PAYMENT_DATE: -1 })
          .toArray();

        const formattedPayments = payments.map(payment => ({
          id: payment._id,
          date: payment.PAYMENT_DATE,
          amount: payment.AMOUNT,
          description: `Bike Ride #${payment.BIKE_ID}`,
          status: payment.STATUS,
          duration: payment.DURATION,
          paymentMethod: payment.PAYMENT_METHOD
        }));

        res.json(formattedPayments);

      } catch (err) {
        console.error("Payments error:", err);
        res.status(500).json({ message: "Error fetching payments" });
      }
    });

    // ==================== SERVER START ====================
    
    app.listen(PORT, () => {
      console.log(`🚲 Smart Bike Rental Server running at http://localhost:${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
      console.log(`📝 Register: http://localhost:${PORT}/register`);
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await client.close();
  console.log('📴 MongoDB connection closed.');
  process.exit(0);
});

run().catch(console.dir);