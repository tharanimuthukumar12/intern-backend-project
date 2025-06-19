const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 6065;

// Middlewares
app.use(cors());
app.use(express.json());

// Root API
app.get("/", (req, res) => {
    res.send("✅ WhiskersAndWhispersCafe API is live!");
});

// MongoDB URI (can also be set via environment variable in Render)
const uri = process.env.MONGO_URI || "mongodb+srv://tharanimuthukumar12:test123@cluster0.amiidbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoClient setup
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
        console.log("✅ MongoDB connected successfully");

        const cloth = client.db("demo").collection("hello");

        // Create (POST)
        app.post("/upload", async (req, res) => {
            const data = req.body;
            const result = await cloth.insertOne(data);
            res.status(201).json(result);
        });

        // Read All (GET)
        app.get("/sns", async (req, res) => {
            const foods = await cloth.find().toArray();
            res.status(200).json(foods);
        });

        // Read by ID (GET)
        app.get("/snsbyid/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await cloth.findOne(filter);
            res.status(200).json(result);
        });

        // Update by ID (PATCH)
        app.patch("/allproductsnacks/:id", async (req, res) => {
            const id = req.params.id;
            const updateFooddata = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: { ...updateFooddata }
            };
            const result = await cloth.updateOne(filter, updateDoc);
            res.status(200).json(result);
        });

        // Delete by ID (DELETE)
        app.delete("/deletesnack/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await cloth.deleteOne(filter);
            res.status(200).json({ success: true, message: "Data deleted", result });
        });

    } catch (err) {
        console.error("❌ MongoDB error:", err);
    }
}

// Start the MongoDB + server
run().catch(console.dir);

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
