import express from "express";
import { conexionBD } from "./bd.js";
import dotenv from "dotenv"; 
import bcrypt from "bcrypt"; //  hashear y verificar contraseñas 
import jwt from "jsonwebtoken"; //  generar y verificar tokens jsonwebtoken

// PUNTO DE ENTRADA DEL SERVIDOR
// NEXT CORRE EN , EXPRESS EN 
// recordar regresar next a https algun dia

dotenv.config(); // cargar las avriables en el.env

const app = express();
const PORT_EXPRESS = process.env.PORT_EXPRESS; 
const PORT_NEXT = process.env.PORT_NEXT;

// obtener la colección de posts
async function getMongoPosts() {
    const database = await conexionBD();
    return database.collection("posts"); // solo hay 1 hasta el momento
}

// --- middleware cors manual --- codigo adaptado de https://bigcodenerd.org/blog/enable-cors-node-js-without-express/
// permite solicitudes desde origenes específicos
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("DEBUGEANDO EL CORS Origin recibido:", origin);

  const allowedOrigins = [`http://localhost:${PORT_NEXT}`,`http://192.168.1.71:${PORT_NEXT}`,]; // origenes permitidos

  if (allowedOrigins.includes(origin)) { 
    res.setHeader("Access-Control-Allow-Origin", origin);
    console.log("DEBUGEANDO EL CORS Origin permitido:", origin); // IMPORTANTE, antes next corria en https y tuve muchos problemas para cebugear, entonces lo puse en http, pero en produccion deberia estar en https
  } else {
    console.log("DEBUGEANDO EL CORS Origin no permitido:", origin); // incluso genere los certificados :((((((
    res.setHeader("Access-Control-Allow-Origin", "null");
  }

  // metodos y headers permitidos
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // responde a preflight requests OPTIONS
  if (req.method === "OPTIONS") {
    console.log("DEBUGEANDO EL CORS Preflight OPTIONS recibido");
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

const SECRET_KEY = process.env.JWT_SECRET; // clave para firmar jwt

// --- middleware de autenticación jwt ---
function autenticarJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "No autorizado" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY); //  https://www.npmjs.com/package/jsonwebtoken
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalido" });
    }
}

// --- middleware solo admin --- , esto no esta implementado aun
function soloAdmin(req, res, next) {
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "No autorizado" });
    next();
}

// --- rutas ---
// login de usuario
app.post("/login", async (req, res) => {
    console.log("DEBUGEANDO Body recibido en /login:", req.body);
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user) {
        console.log("DEBUGEANDO Usuario no encontrado:", username);
        return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const passValida = await bcrypt.compare(password, user.passwordHash); // compara hash
    console.log("DEBUGEANDO Password valido?", passValida);

    if (!passValida) {
        console.log("DEBUGEANDO Contraseña incorrecta para usuario:", username);
        return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" } // expira en 1 hora
    );

    console.log("DEBUGEANDO Login exitoso para:", username);
    res.json({ success: true, token, username: user.username, role: user.role });
});

// registrar un nuevo usuario
app.post("/registro", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
    }

    // verificar si ya existe
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // agregar nuevo usuario a la lista
    users.push({
      username,
      passwordHash,
      role: "user", // por defecto todos los nuevos usuarios son 'user'
    });

    console.log("DEBUGEANDO Nuevo usuario registrado:", username);
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});


// obtener todos los posts
app.get("/api/posts", async (req, res) => {
    try {
        const collection = await getMongoPosts();
        const posts = await collection
            .find({}, { projection: { slug: 1, titulo: 1, fecha: 1 } }) // solo campos seleccionados
            .sort({ fecha: -1 }) // orden descendente por fecha (date en la bd)
            .toArray();

        console.log("posts obtenidos:", posts);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error al obtener los posts" });
    }
});

// obtener un post por slug
app.get("/api/posts/:slug", async (req, res) => {
    try {
        const collection = await getMongoPosts();
        const post = await collection.findOne({ slug: req.params.slug });

        console.log("post encontrado:", post);
        if (!post) return res.status(404).json({ error: "post no encontrado" });

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error al obtener el post" });
    }
});

// crear un nuevo post (solo admin) ESTO AUN NO ESTA IMPLEMENTADO
app.post("/api/posts", autenticarJWT, soloAdmin, async (req, res) => {
    try {
        const { slug, titulo, fecha, contenido, tags } = req.body;
        const collection = await getMongoPosts();
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
        res.status(500).json({ error: "error al crear el post" });
    }
});

// --- iniciar servidor ---
app.listen(PORT_EXPRESS, () =>
    console.log(`servidor express corriendo en http://localhost:${PORT_EXPRESS}`)
);
