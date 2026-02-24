const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://test:test123@cluster0.bbkjn7s.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    const db = client.db("ergovision"); // Guessing DB name based on python app
    // Alternatively, let's list all databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log("Databases:");
    for (let dbInfo of dbs.databases) {
      console.log(`- ${dbInfo.name}`);
      if (dbInfo.name !== "admin" && dbInfo.name !== "local") {
        const currentDb = client.db(dbInfo.name);
        const collections = await currentDb.listCollections().toArray();
        console.log(`  Collections in ${dbInfo.name}:`);
        for (let coll of collections) {
          console.log(`  - ${coll.name}`);
          const sample = await currentDb.collection(coll.name).findOne({});
          if (sample) {
            console.log(
              `    Sample doc keys: ${Object.keys(sample).join(", ")}`,
            );
          }
        }
      }
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
