const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
let database;

async function getDatabase() {
    const client = await mongoClient.connect('mongodb://127.0.0.1:27017');
    database = client.db('shop');
    if (!database) {
        console.log("not connection database");
    } else {
        console.log("connection database");
    }
  return database;
}


module.exports={
    getDatabase
}