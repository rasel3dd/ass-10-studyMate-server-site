const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const e = require('express');
const app = express();
const port = process.env.PORT || 5000;
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
   

    const db = client.db('partnerProfile');
    const productsCollection = db.collection('allProfile');
    const userCollection = db.collection('users');
    const myConnection = db.collection('connection');
    const topCollection = db.collection('topList');


      app.post('/connection', async (req, res) => {
      const partnerConnection = req.body;
      const exists = await myConnection.findOne({ email: partnerConnection.email });

      if (exists) return res.send({ message: "partner already exist" });

      const result = await myConnection.insertOne(partnerConnection);
      res.send(result);
    });

   app.get('/connection', async (req, res) => {
      const email = req.query.email;
      const query = email ? { email } : {};
      const result = await myConnection.find(query).toArray();
      res.send(result);
    });
   app.delete('/connection/:id', async (req, res) => {
      const id = req.params.id;

      const result = await myConnection.deleteOne({ _id: id });  // string ID
      res.send(result);
    });


app.put('/connection/:id', async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;

      const result = await myConnection.updateOne(
        { _id: id },               // ← SAME TYPE as delete & insert
        { $set: updatedInfo }
      );

      res.send(result);
    });


    app.post('/users', async(req, res) =>{
      
      const newUser = req.body;
      const query = { email: newUser.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser){
        res.send({message: 'user already exist'})
      }
      else{
         const result = await userCollection.insertOne(newUser);
      res.send(result);

      }

     
    })



    app.post('/connection', async(req, res) =>{
      const newProfile = req.body;
      const newUser = await userCollection.findOne({ email: newProfile.email });
  if (!newUser) {
    return res.status(403).send({ message: 'User not found or not logged in' });
  }
   const existingProfile = await productsCollection.findOne({ email: newProfile.email });
  if (existingProfile) {
    return res.status(400).send({ message: 'Partner profile already exists' });
  }
    const result = await productsCollection.insertOne(newProfile);
  res.send(result);
});
    app.get('/topList', async ( req, res) =>{
      const cursor = topCollection.find().sort({ rating: -1 });
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/topList', async (req, res) => {
  try {
    const newProfile = req.body;

    const result = await topCollection.insertOne(newProfile);

    res.send({ insertedId: result.insertedId });
  } catch (error) {
    res.status(500).send({ message: "Failed to save in topList", error });
  }
});

     app.get('/partner', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) query.email = email;

      const cursor = productsCollection.find(query).limit(30);
      const result = await cursor.toArray();
      res.send(result);
    });

   
    
    
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