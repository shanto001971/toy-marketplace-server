const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // const categoryCollection = client.db("ToyStory").collection("category");
        // const subCategoriesCollection = client.db("ToyStory").collection("categories");
        const toyCollection = client.db("ToyStory").collection("toys");

       
        app.get('/toys', async (req, res) => {
            console.log(123)
            const cursor = toyCollection.find().sort( { "price": 1 } );
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/toys/my', async (req, res) => {
            const email = req.query.email;
            console.log()
            const query = { email: email };
            const toys = await toyCollection.find(query).toArray();
            res.send(toys);
        });

        // app.get('/subCategories', async (req, res) => {
        //     const id = req.params.id
        //     const query = {id: id}
        //     const result = await subCategoriesCollection.find(query).toArray();
        //     res.send(result);
        // });
        

        // app.get('/category', async (req, res) => {
            
        //     console.log(req.query)

            
            
        //     // let queryItem = {};
        //     // if (req.query?.email) {
        //     //     queryItem = { email: req.query.email }
        //     // }
        //     const result = await categoryCollection.find().toArray();
        //     res.send(result)
        // });

        app.post('/postToy', async (req, res) => {
            const toyData = req.body;
            const result = await toyCollection.insertOne(toyData)
            res.send(result);
        });

        app.delete('/toys/my/:id', async (req, res) => {
            const id = req.params.id;
            const result = await toyCollection.deleteOne({ _id: new ObjectId(id) });
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
