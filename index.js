const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hia2w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("services"));
app.use(fileUpload());

const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const contactInfoCollection = client
    .db("contactInfo")
    .collection("allContacts");

  //  Add Contact in the home page

  app.post("/addContact", (req, res) => {
    const file = req.files.file;
    const encImg = file.data.toString("base64");
    const image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };
    const { name, email, location, message } = req.body;
    ordersCollection
      .insertOne({ name, email, location, message, image })
      .then((result) => {
        return res.send(result.insertedCount > 0);
      });
  });

  app.get("/getContacts", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});

app.listen(process.env.PORT || port);
