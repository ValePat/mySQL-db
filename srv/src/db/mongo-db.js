
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://userOne:CEK1d9SyJArXnXAK@cluster0.sect1ps.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {

    tls: true,  // Ensure TLS/SSL is enabled
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

async function connectMongoClient() {
  try {
    // Connect the client toz the server	(optional starting in v4.7)
    await client.connect();
    console.log("Connection attempted")
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Client closed")
  }
}

async function closeMongoClient() {
    try {
        await client.close();
        console.log("MongoDB client closed.");
    } catch (err) {
        console.error("Error closing MongoDB client:", err);
    }
}

//connectMongoClient().catch(console.dir);

module.exports = client;
