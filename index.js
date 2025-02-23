const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())


// marketplace
// LMO8C5gJztEKMzkV



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8luat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    //  start ///

    const database = client.db("jobsBD");
    const marketPlaceCollection = database.collection("jobs");


    app.get("/jobs", async (req, res) => {
      const cursor = marketPlaceCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })


    app.post("/jobs", async (req, res) => {
      const jobBody = req.body
      const result = marketPlaceCollection.insertOne(jobBody)
      res.send(result)
    })

    app.get("/jobsingle/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await marketPlaceCollection.findOne(query);
      res.send(result)
    })

    app.get("/jobs/:email", async (req, res) => {
      const email = req.params.email
      console.log(req.params.email);
      const query = { email: email };
      const result = await marketPlaceCollection.find(query).toArray();
      res.send(result)
    })





    // dilet//

    app.delete("/jobs/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await marketPlaceCollection.deleteOne(query);
      res.send(result)
    })

    //  update ///


    app.put("/jobsingle/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const upBody = req.body
      const updateDoc = {
        $set: 
          upBody
      };
      const result = await marketPlaceCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
