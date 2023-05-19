const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is running')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mi7otul.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const categoryCollection = client.db("ToyStory").collection("category");
        const toyCollection = client.db("ToyStory").collection("product");

        app.get('/category', async (req, res) => {
            const ruselt = await categoryCollection.find().toArray();
            res.send(ruselt);
        })

        app.get('/category', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await categoryCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/category', async (req, res) => {
            const categoryData = req.body;
            const result = await categoryCollection.insertOne(categoryData)
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// toy-story-3
// yR3tTUMp3hGUJusR

app.listen(port, () => {
    console.log(`server is running on port${port}`)
})
