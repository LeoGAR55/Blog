import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
const MONGO_URL = process.env.MONGO_URL;
const DATABASE = process.env.DATABASE; 

// el objeto mongoclient crea la conexion a la bd y nos permite realizar operaciones, es necesario pasarle la url al mongoclient
/*
el mongoclient tambien maneja el pool de conexiones y las mantiene en una memoria temporal para asignarlas 
y no tener que que estar haciendo y deshaciendo conexiones
*/
const client = new MongoClient(MONGO_URL, { // ver mas parametros en https://www.mongodb.com/docs/languages/python/pymongo-driver/current/connect/connection-options/connection-pools/
  maxPoolSize: 10,       
  minPoolSize: 2,       
  maxIdleTimeMS: 60000,  // The maximum time that a connection can remain idle in the pool. When a connection exceeds this limit, PyMongo closes the connection and removes it from the pool.
});

let bd_instancia; 

export async function conexionBD() {
  if (bd_instancia) return bd_instancia; // si existe conexion se usa la existente (singleton)

  try { 
    await client.connect(); // conectar al cluster, cuando se hace un client connect el driver de mongo deja en algun lugar todas las conexiones abiertas 
    console.log("conexion exitosa a la ");

    bd_instancia = client.db(DATABASE); 
    return bd_instancia;
  } catch (e) {
    console.error("Error conectando a la bd:", e);
    throw e;
  }
}


