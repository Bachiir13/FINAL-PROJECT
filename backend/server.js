require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const http = require("http");
const { Server } = require("socket.io");

const contactRoutes = require("./routes/contacts.routes");
const actualiteRoutes = require("./routes/actualite.routes");
const coursRoutes = require("./routes/cours.routes");
const formationRoutes = require("./routes/formation.routes");
const inscriptionRoutes = require("./routes/inscription.routes");
const pedagogieRoutes = require("./routes/pedagogie.routes");
const userRoutes = require("./routes/user.routes");
const temoignageRoutes = require("./routes/temoignage.routes");
const inscriptionFormationRoutes = require('./routes/inscriptionformation.routes');
const messagesRoutes = require('./routes/messages.routes');

const app = express();
const port = process.env.PORT || 3001;

/* ---------- Sécurité : middlewares ---------- */
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(xssClean());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(bodyParser.json());

/* ---------- Routes principales ---------- */
app.get("/", (_, res) => res.send("🚀 API TechEcole en ligne"));

app.use("/contacts", contactRoutes);
app.use("/actualites", actualiteRoutes);
app.use("/cours", coursRoutes);
app.use("/formations", formationRoutes);
app.use("/inscriptions", inscriptionRoutes);
app.use("/pedagogies", pedagogieRoutes);
app.use("/users", userRoutes);
app.use("/temoignages", temoignageRoutes);
app.use("/inscriptionformations", inscriptionFormationRoutes);
app.use("/messages", messagesRoutes);

/* ---------- Route reCAPTCHA ---------- */
app.post('/verify-captcha', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token reCAPTCHA manquant." });
  }

  const secretKey = process.env.RECAPTCHA_SECRET;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await fetch(verificationURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();

    if (data.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, errors: data["error-codes"] });
    }
  } catch (error) {
    console.error("❌ Erreur reCAPTCHA :", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la vérification reCAPTCHA." });
  }
});

/* ---------- Serveur HTTP & Socket.io ---------- */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
  console.log(`Utilisateur connecté: ${socket.id}`);

  // Exemple : gestion d’une room utilisateur pour recevoir les messages ciblés
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`Utilisateur ${userId} a rejoint sa room.`);
  });

  // Exemple : réception d’un message et retransmission au destinataire
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log(`Message de ${senderId} à ${receiverId} : ${message}`);

    // TODO: Sauvegarder message dans la BDD ici si besoin

    // Emission vers la room du destinataire (s’il est connecté)
    io.to(receiverId).emit("receiveMessage", {
      senderId,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
  });
});

/* ---------- Démarrage du serveur ---------- */
server.listen(port, () => {
  console.log(`✅ Serveur démarré avec Socket.io : http://localhost:${port}`);
});
