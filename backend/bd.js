import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "o se puede poner la url aqui directo";
const DATABASE = process.env.DATABASE || "hey"; 
const client = new MongoClient(MONGO_URL);

let db; // variable para almacenar la base de datos

export async function connectToDatabase() {
  if (db) return db; // si existe conexion se usa la existente

  try {
    await client.connect(); // conectar al cluster
    console.log("MongoDB conectado");

    db = client.db(DATABASE); 
    return db;
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1); 
  }
}
