const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://saurabh:kdNPW7ceiDNTvMBa@cluster-cruise.aapwx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-cruise";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("cruise_packages");
    console.log("Connected to MongoDB successfully!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

module.exports = {
  connectDB,
  getDB,
  client
}; 