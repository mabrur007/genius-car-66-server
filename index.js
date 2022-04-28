// step 01
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // step 06

// step 02
app.use(cors());
app.use(express.json());

// step 03
app.get('/', (req, res) => {
    res.send('Running Server');
})

// step 04
app.listen(port, () => {
    console.log('Listening from port', port);
})

// ---------- step 06 ----------
// connecting the database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvddw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try { 
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        // fetching all data from the database to server -> step 07
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query); // for multiple search
            const services = await cursor.toArray();
            res.send(services);
        });

        // for accessing a single document -> step 08
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // data comming from AddService component -> step 09
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // deleting an item from the UI -> step 10
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id; 
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{}
}
run().catch(console.dir);
// ----------- step 06 -----------



// user: geniusUser
// pass: j16QMlccm79tFBkv