const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000

//midlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.SECRET_KEY}@cluster0.0zrlznh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect to the "insertDB" database and access its "databaseCollection" collection
    const databaseCollection = client.db("Art&CraftDB").collection("art&craft");

    app.get('/artcrafts', async (req, res) => {
      const artcrafts = await databaseCollection.find().toArray();
      res.send(artcrafts);
    })

    app.get('/artcraft/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await databaseCollection.findOne(query);
      res.send(result)
    })
    app.get('/myartcraft/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await databaseCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/addartcraft', async (req, res) => {
      const addartcraft = req.body;
      const result = await databaseCollection.insertOne(addartcraft);
      res.send(result);
    })

    app.put('/updateartcraft/:id', async (req, res) => {
      const id = req.params.id;
      const artcraft = req.body;
      const quary = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateartcraft = {
        $set: {
          name: artcraft.name,
          image: artcraft.image,
          email: artcraft.email,
          item_name: artcraft.item_name,
          subcategory_Name: artcraft.subcategory_Name,
          processing_time: artcraft.processing_time,
          description: artcraft.description,
          price: artcraft.price,
          rating: artcraft.rating,
          stock: artcraft.stock,
          customization: artcraft.customization
        },
      };
      const result = await databaseCollection.updateOne(quary, updateartcraft, options);
      res.send(result)

    })

    app.delete('/myartcraft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await databaseCollection.deleteOne(query)
      res.send(result)
    })



    // Connect the client to the server	()
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//routes
app.get('/', (req, res) => {
  res.send('Art & Craft Store Server is Running......')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})