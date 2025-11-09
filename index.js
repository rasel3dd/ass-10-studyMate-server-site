const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://StudyMate-db-user:zaSip8DHWF1MyjM5@cluster0.k6tagxb.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
   

    const db = client.db('partnerProfile')
    const productsCollection = db.collection('allProfile')
    app.post('/products', async(req, res) =>{
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);

    })
     app.get('/products', async(req, res) =>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    app.patch('/products/:id', async(req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = {_id: new ObjectId(id)}
      const update ={
        $set: updatedProduct
      }
      const result = await productsCollection.updateOne(query, update);
      res.send(result);
    })

    app.delete('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productsCollection.deleteOne(query);
      res.send(result);

    })
     await client.db("admin").command({ping: 1});
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('studyMate server is running' )
})
app.listen(port, () =>{
    console.log(`studyMate server is running o port: ${port}`)
})