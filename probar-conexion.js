require("dotenv").config();
const { MongoClient } = require("mongodb");

async function probarConexion() {
  const cliente = new MongoClient(process.env.MONGODB_URI);
  try {
    await cliente.connect();
    await cliente.db("admin").command({ ping: 1 });
    console.log("Conexión exitosa con MongoDB");
  } finally {
    await cliente.close();
  }
}

probarConexion().catch((error) => console.error("Error:", error.message));
