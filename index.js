const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER}:${process.env.USER_PASS}@cluster0.sistehv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("dreamgalaxyshop2").collection("users");
    const productDataCollection = client
      .db("dreamgalaxyshop2")
      .collection("ProductData");
    const ProductPurchaseListCollection = client
      .db("dreamgalaxyshop2")
      .collection("ProductPurchaseList");
    const ProductAddToCollection = client
      .db("dreamgalaxyshop2")
      .collection("ProductAddToCart");

    // Save User Email And Role In DB
    // Save User Email And Role In DB
    app.put('/users/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const query = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(query, updateDoc, options);
      console.log(result);
      res.send(result);
    });

    // Own Data Find
    app.get("/users/:email", async (req, res) => {
      const result = await userCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    });

    // Post Product Data
    app.post("/data", async (req, res) => {
      const newItem = req.body;
      const result = await productDataCollection.insertOne(newItem);
      res.send(result);
    });

    // Get all Product
    app.get("/data", async (req, res) => {
      const result = await productDataCollection.find().toArray();
      res.send(result);
    });


    // Get Single Id
    app.get("/data/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id), // Fix: Use the correct variable name 'id'
      };
      const user = await productDataCollection.findOne(query);
      res.send(user);
    });



    app.put('/Product_Data/:id', async (req, res) => {
      try {
        const id = req.params.id;

        const query = {
          _id: new ObjectId(id), // Fix: Use the correct variable name 'id'
        }; // Assuming _id is a string in your data
        const updatedData = req.body;

        // Update the user data in the MongoDB collection
        const result = await productDataCollection.updateOne(query, { $set: updatedData });

        if (!result) {
          console.error('User not found for ID:', id);
          return res.status(404).json({ error: 'User not found' });
        }

        res.json(result);
      } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });



    app.delete('/data/:id', async (req, res) => {  //xxxx==== delete data from database xxxxxxx
      const id = req.params.id
      console.log("deleting id", id);
      const query = { _id: new ObjectId(id) };                                                             //𝐃𝐄𝐋𝐄𝐓𝐄
      const Drone = await productDataCollection.deleteOne(query);
      res.send(Drone)
    })

    // Post Product purchase Data
    app.post("/ProductPurchase", async (req, res) => {
      const newItem = req.body;
      const result = await ProductPurchaseListCollection.insertOne(newItem);
      res.send(result);
    });

    // Get all Product
    app.get("/ProductPurchase_Data_UI", async (req, res) => {
      const result = await ProductPurchaseListCollection.find().toArray();
      res.send(result);
    });

    // Post Product Add To cart
    app.post("/ProductAddToCart", async (req, res) => {
      const newItem = req.body;
      const result = await ProductAddToCollection.insertOne(newItem);
      res.send(result);
    });
    // Get Product Add To cart
    // GPT Backend
    app.get("/ProductAddToCart", async (req, res) => {
      const userEmail = req.query.userEmail; // Extract the userEmail from the query parameters
      const result = await ProductAddToCollection.find({ userEmail }).toArray();
      res.send(result);
    });
    app.get("/ProductCart", async (req, res) => {
      // Extract the userEmail from the query parameters
      const result = await ProductAddToCollection.find().toArray();
      res.send(result);
    });

    app.delete('/Delete_ProductAddToCart/:id', async (req, res) => {  //xxxx==== delete data from database xxxxxxx
      const id = req.params.id
      console.log("deleting id", id);
      const query = { _id: new ObjectId(id) };                                                             //𝐃𝐄𝐋𝐄𝐓𝐄
      const Drone = await ProductAddToCollection.deleteOne(query);
      res.send(Drone)
    })


    app.get("/prod/:email", async (req, res) => {
      const result = await ProductAddToCollection.find({ userEmail: req.params.email }).toArray();
      res.send(result);
    });

    app.get("/prod", async (req, res) => {
      const result = await ProductAddToCollection.find().toArray();
      res.send(result);
    });
    app.get("/order", async (req, res) => {
      const result = await ProductPurchaseListCollection.find().toArray();
      res.send(result);
    });


    // app.get('/Product_Data/:id', async (req, res) => {
    //   try {
    //     const id = req.params.id;

    //     const query = { _id: new ObjectId(id) }
    //     // const query = { _id: id }; 
    //     const result = await productDataCollection.findOne(query);

    //     if (!result) {
    //       console.error('User not found for ID:', id);
    //       return res.status(404).json({ error: 'User not found' });
    //     }

    //     res.json(result);
    //   } catch (error) {
    //     console.error('Error retrieving user data:', error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // });

    app.delete('/delete_Product/:id', async (req, res) => {  //xxxx==== delete data from database xxxxxxx
      const id = req.params.id
      console.log("deleting id", id);
      const query = { _id: new ObjectId(id) };                                                             //𝐃𝐄𝐋𝐄𝐓𝐄
      const Drone = await ProductPurchaseListCollection.deleteOne(query);
      res.send(Drone)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({
    //     ping: 1
    // });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`running ${port}`);
});

