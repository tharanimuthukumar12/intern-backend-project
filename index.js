const express=require('express');
const cors=require('cors');

const app=express();
const port=6065;

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("Welcome to api");
})


const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = "mongodb+srv://tharanimuthukumar12:test123@cluster0.amiidbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
   
    const cloth=client.db("demo").collection("hello");

    app.post("/upload",async(req,res)=>{
        const data=req.body;
        const result=await cloth.insertOne(data);
        res.send(result);
    })
     app.get("/sns",async(req,res)=>{
      const foods=cloth.find();
      const result=await foods.toArray();
      res.send(result);
  })

  app.get("/snsbyid/:id",async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)};
    const result=await cloth.findOne(filter);
    res.send(result);
  })
  
  app.patch("/allproductsnacks/:id",async(req,res)=>{
    
      const id=req.params.id;
      const updateFooddata=req.body;
      const filter={_id:new ObjectId(id)};

      const updateDoc={
          $set:{
              ...updateFooddata
          },
      }
      const options ={upsert:true};
      const result=await cloth.updateOne(filter,updateDoc,options);
      res.send(result);
  })

  app.delete('/deletesnack/:id',async(req,res)=>{
      const id=req.params.id;
      console.log(id)
      const filter={_id:new ObjectId(id)};
      const result=await cloth.deleteOne(filter);
      res.status(200).json({success:true , message:"data deleted successfully", result});
  })
    await client.db("admin").command({ ping: 1 });


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`connected to ${port}`)
})