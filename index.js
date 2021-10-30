const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 5000

// middle wear

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzbym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("LandmarkTourDb")
        const toursCollection = database.collection('tours')
        const ordersCollection = database.collection('orders')

        // get api
        app.get('/services', async (req, res) => {
            const service = toursCollection.find({})
            const result = await service.toArray()
            res.send(result)
        });
        // post api
        app.post('/addServices', async (req, res) => {
            const services = req.body
            const result = await toursCollection.insertOne(services)
            res.json(result)
        });
        // add products

        app.post('/addOrder', async (req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order)
            res.json(result)

        });
        // get order api
        app.get('/myOrders/:email', async (req, res) => {
            const userEmail = req.params.email
            const result = await ordersCollection.find({ email: userEmail }).toArray();
            res.send(result)
        });
        // delete order api
        app.delete('/deleteOrders/:id', async (req, res) => {
            const result = await ordersCollection.deleteOne({ _id: (req.params.id) })
            res.send(result)
        });
        // manage all order
        app.get('/manageOrder', async (req, res) => {
            const manageOrder = ordersCollection.find({})
            const result = await manageOrder.toArray()
            res.send(result)
        });
        //  get status api
        app.get('/updateStatus/:id', async (req, res) => {
            const id = req.params.id
            const result = await ordersCollection.findOne({ _id: id });
            res.send(result)
        });
        // update status api

        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const newStatus = req.body
            const filter = { _id: id }
            const updateOrder = { $set: { status: newStatus.status } }
            const result = await ordersCollection.updateOne(filter, updateOrder)
            console.log(result)
            res.json(result)

        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('The Landmark Tour server are running')
})
app.listen(port, () => {
    console.log('Landmark tour port ', port)
})