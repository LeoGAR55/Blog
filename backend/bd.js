import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
const MONGO_URL = process.env.MONGO_URL || "o se puede poner la url aqui directo";
const DATABASE = process.env.DATABASE || "hey"; 
const client = new MongoClient(MONGO_URL);

let db; // variable para almacenar la base de datos

export async function conexionBD() {
  if (db) return db; // si existe conexion se usa la existente (singleton)

  try { //try para manejar errores
    await client.connect(); // conectar al cluster, cuando se hace un client connect el driver de mongo deja en algun lugar todas las conexiones abiertas 
    console.log("Conectado a MongoDB");

    db = client.db(DATABASE); 
    return db;
  } catch (e) {
    console.error("Error conectando a la db:", e);
    process.exit(1); 
  }
}
