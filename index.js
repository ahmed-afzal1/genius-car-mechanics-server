const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.port || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.json())
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.38is2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      
      const database = client.db('carMechanic');
      const servicesCollection = database.collection('services');

      app.get('/services',async(req,res)=>{
          const cursor = servicesCollection.find({});
          const result = await cursor.toArray();
          res.json(result);
      })

      app.post('/services',async(req,res)=>{
        const service = req.body;
        const result = await servicesCollection.insertOne(service);
        res.send(result);
      })

      app.get('/services/:id',async(req,res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)}
          const result = await servicesCollection.findOne(query);
          res.json(result);
      })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('App inititate');
})

app.listen(port,()=>{
    console.log('App Running on',port);
})