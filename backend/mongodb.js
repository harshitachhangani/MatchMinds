const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017/hackbud";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = client;