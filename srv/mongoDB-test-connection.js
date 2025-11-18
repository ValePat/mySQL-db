
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const uri = "mongodb+srv://userOne:CEK1d9SyJArXnXAK@cluster0.sect1ps.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {

    tls: true,  
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const jobsCollection = client.db("react_jobs").collection("jobs");
    const jobs = jobsCollection.find();
    await jobs.forEach((doc) => console.log(doc));

    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
    console.log("Client closed")
  }
}

async function register () {
  try {

    await client.connect();
    const db = client.db("react_jobs");
    const usersCollection = db.collection("users");

    const hashedPassword = await bcrypt.hash("ao", 10);
    const user = { EMAIL: "ao@ao", USER_NAME: "ao", PASSWORD: hashedPassword };

    if( await usersCollection.findOne({ EMAIL: user.EMAIL })) {userFound = true} else {userFound = false}
    if(userFound){
      console.log("Account già registrato");
    } else {
        const result = await usersCollection.insertOne(user);
        console.log("Account inserito");
    }
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
}

async function testPassword () {

  try{
    const db = client.db("react_jobs");
    const usersCollection = db.collection("users");
    const userData = { EMAIL: "ao@ao", USER_NAME: "ao"};
    const user = await usersCollection.findOne({ EMAIL: userData.EMAIL });
    console.log(user.PASSWORD)

    if (await bcrypt.compare("AO", user.PASSWORD)) {
      console.log("password matches");
    } else {
      console.log("password do not match")
    }
  } catch (e) {
    console.log(e)
  } finally {
    await client.close();
  }

}

async function login () {
  try {
    const db = client.db("react_jobs");
    const usersCollection = db.collection("users");
    const dbUser = await usersCollection.findOne({ EMAIL: "bleh@bleh" });
    console.log(dbUser)

  } finally {
    await client.close();
  }
  
  
}

run();
