import express from "express";
import { MongoClient } from "mongodb"; // cliente oficial de mongodb 
import dotenv from "dotenv"; 
import bcrypt from "bcrypt"; //  hashear y verificar contraseñas 
import jwt from "jsonwebtoken"; //  generar y verificar tokens jsonwebtoken

// PUNTO DE ENTRADA DEL SERVIDOR
// NEXT CORRE EN 3000, EXPRESS EN 5000
// recordar regresar next a https algun dia

dotenv.config(); // cargar las avriables en el.env

const app = express();
const PORT = process.env.PORT ||  "algo"; 

// CONEXION A MONGOOOOOOOOOOOOOOOOOOOOOOOOOOO
const MONGO_URL = process.env.MONGO_URL;
const DATABASE = process.env.DATABASE || "hey";
const client = new MongoClient(MONGO_URL); // instancia de mongo client
let db;

// funcion para conectar a la bd de mongo
async function connectToDatabase() {
    if (db) return db; // retorna db si hay conexion para usarla
    try {
        await client.connect();
        console.log("MongoDB conectado");
        db = client.db(DATABASE);
        return db;
    } catch (err) {
        console.error("Error conectando a MongoDB:", err);
        process.exit(1);
    }
}

// obtener la colección de posts
async function getPostsCollection() {
    const database = await connectToDatabase();
    return database.collection("posts");
}

// --- middleware cors manual ---
// permite solicitudes desde origenes específicos
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("[DEBUG CORS] Origin recibido:", origin);

  const allowedOrigins = ["http://localhost:3000", "http://192.168.1.71:3000"]; // origenes permitidos
  if (allowedOrigins.includes(origin)) { 
    res.setHeader("Access-Control-Allow-Origin", origin);
    console.log("[DEBUG CORS] Origin permitido:", origin); // IMPORTANTE, antes next corria en https y tuve muchos problemas para cebugear, entonces lo puse en http, pero en produccion deberia estar en https
  } else {
    console.log("[DEBUG CORS] Origin no permitido:", origin); // incluso genere los certificados :((((((
    res.setHeader("Access-Control-Allow-Origin", "null");
  }

  // metodos y headers permitidos
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // responde a preflight requests OPTIONS
  if (req.method === "OPTIONS") {
    console.log("[DEBUG CORS] Preflight OPTIONS recibido");
    return res.sendStatus(200);
  }

  next();
});

// --- middleware json ---
// parsea json y urlencoded en el body de requests
app.use(express.json()); // https://expressjs.com/en/api.html#express.json
app.use(express.urlencoded({ extended: true })); 

// --- usuarios simulados con contraseñas hasheadas ---
const users = [
    {
        username: "admin",
        passwordHash: await bcrypt.hash("admin", 10), // bcrypt hash https://www.npmjs.com/package/bcrypt
        role: "admin",
    },
    {
        username: "user",
        passwordHash: await bcrypt.hash("user", 10),
        role: "user",
    },
];

const SECRET_KEY = process.env.JWT_SECRET || "mi_clave_secreta"; // clave para firmar jwt

// --- middleware de autenticación jwt ---
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "No autorizado" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY); //  https://www.npmjs.com/package/jsonwebtoken
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
}

// --- middleware solo admin --- , esto no esta implementado aun
function adminOnly(req, res, next) {
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "No autorizado" });
    next();
}

// --- rutas ---
// login de usuario
app.post("/login", async (req, res) => {
    console.log("[DEBUG] Body recibido en /login:", req.body);
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user) {
        console.log("[DEBUG] Usuario no encontrado:", username);
        return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash); // compara hash
    console.log("[DEBUG] ¿Password válido?", validPassword);

    if (!validPassword) {
        console.log("[DEBUG] Contraseña incorrecta para usuario:", username);
        return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" } // expira en 1 hora
    );

    console.log("[DEBUG] Login exitoso para:", username);
    res.json({ success: true, token, username: user.username, role: user.role });
});

// obtener todos los posts
app.get("/api/posts", async (req, res) => {
    try {
        const collection = await getPostsCollection();
        const posts = await collection
            .find({}, { projection: { slug: 1, titulo: 1, fecha: 1 } }) // solo campos seleccionados
            .sort({ fecha: -1 }) // orden descendente por fecha (date en la bd)
            .toArray();

        console.log("Posts obtenidos:", posts);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener los posts" });
    }
});

// obtener un post por slug
app.get("/api/posts/:slug", async (req, res) => {
    try {
        const collection = await getPostsCollection();
        const post = await collection.findOne({ slug: req.params.slug });

        console.log("Post encontrado:", post);
        if (!post) return res.status(404).json({ error: "Post no encontrado" });

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener el post" });
    }
});

// crear un nuevo post (solo admin) ESTO AUN NO ESTA IMPLEMENTADO
app.post("/api/posts", authMiddleware, adminOnly, async (req, res) => {
    try {
        const { slug, titulo, fecha, contenido, tags } = req.body;
        const collection = await getPostsCollection();
        const result = await collection.insertOne({
            slug,
            titulo,
            fecha: new Date(fecha),
            contenido,
            tags,
        });
        res.json({ success: true, insertedId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear el post" });
    }
});

// --- iniciar servidor ---
app.listen(PORT, () =>
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`)
);
