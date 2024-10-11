const express = require('express');
 const app = express();
 require('dotenv').config()
 const cors = require('cors');
 const port = process.env.PORT || 5000;


 app.use(cors());
 app.use(express.json());

 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.pc17z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 
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
     
     await client.connect();
     const coffeeDB = client.db('coffee-db').collection('coffees');
     
    app.get('/coffees', async(req, res)=>{
      const result = await coffeeDB.find().toArray();
      res.send(result);
    });

     app.post('/coffees',async(req, res) => {
        const coffee = req.body;
        console.log(coffee);
        const result = await coffeeDB.insertOne(coffee);
        res.send(result);
     })
     app.get('/coffees/:id',async (req, res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await coffeeDB.findOne(query);
      res.send(result);
     });
     app.put('/coffees/:id',async(req,res)=>{
      const id = req.params.id
      const data = req.body
      console.log(data);
      const filter ={_id: new ObjectId(id)}
      const option = {upsert: true}
      const updateDoc ={
        $set:{
          name: data.name,
          chef: data.chef,
          price: data.price,
          time: data.time,
          Supplier: data.Supplier,
          Taste: data.Taste,
          Category: data.Category,
          Details: data.details,
          photoURL: data.photoURL
        }
      }
      const result = await coffeeDB.updateOne(filter,updateDoc,option)
      res.send(result);
     })
     app.delete('/coffees/:id',async (req, res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await coffeeDB.deleteOne(query);
      res.send(result);
     });
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     // Ensures that the client will close when you finish/error
    // await client.close();
   }
 }
 run().catch(console.dir);
 
 app.get('/',(req,res)=>{
    res.send("welcome");
 })

 app.listen(port,(req,res)=>{
    console.log("listening on port",port);
 });