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

// DB
const pool = require("./db");

// Routes
const contactRoutes = require("./routes/contacts.routes");
const actualiteRoutes = require("./routes/actualite.routes");
const coursRoutes = require("./routes/cours.routes");
const formationRoutes = require("./routes/formation.routes");
const inscriptionRoutes = require("./routes/inscription.routes");
const pedagogieRoutes = require("./routes/pedagogie.routes");
const userRoutes = require("./routes/user.routes");
const temoignageRoutes = require("./routes/temoignage.routes");
const inscriptionFormationRoutes = require("./routes/inscriptionformation.routes");
const messagesRoutes = require("./routes/messages.routes");

const app = express();
const port = process.env.PORT || 3001;

// === Middleware: Logger des requêtes ===
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// === Sécurité & Middleware globaux ===
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"], // Mieux utiliser un tableau
  allowedHeaders: ["Content-Type", "Authorization"] // Mieux utiliser un tableau
}));
app.use(xssClean());
app.use(mongoSanitize());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(bodyParser.json());

// === Routes principales ===
app.get("/", (_, res) => {
  console.log("Route racine / appelée");
  res.send("🚀 API TechEcole en ligne");
});

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
app.use('/uploads', express.static('uploads'));

// === reCAPTCHA ===
app.post('/verify-captcha', async (req, res) => {
  console.log("POST /verify-captcha appelé");
  const { token } = req.body;

  if (!token) {
    console.warn("Token reCAPTCHA manquant");
    return res.status(400).json({ success: false, message: "Token reCAPTCHA manquant." });
  }

  try {
    // Il faut envoyer les paramètres en URL-encoded
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPTCHA_SECRET);
    params.append('response', token);

    const response = await fetch(verificationURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await response.json();

    if (data.success) {
      console.log("reCAPTCHA validé avec succès");
      return res.status(200).json({ success: true });
    }

    console.warn("Erreur reCAPTCHA:", data["error-codes"]);
    return res.status(400).json({ success: false, errors: data["error-codes"] });

  } catch (error) {
    console.error("❌ Erreur reCAPTCHA :", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la vérification reCAPTCHA." });
  }
});

// === Middleware gestion erreurs globales ===
app.use((err, req, res, next) => {
  console.error("Erreur attrapée par middleware global :", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// === Socket.IO Setup ===
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`📡 Utilisateur connecté : ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    const room = userId.toString();
    socket.join(room);
    console.log(`👤 Utilisateur ${room} a rejoint sa room.`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    console.log(`✉️ Message de ${senderId} à ${receiverId} : ${message}`);

    try {
      const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *`,
        [senderId, receiverId, message]
      );

      const savedMessage = result.rows[0];

      // Émettre au destinataire
      io.to(receiverId.toString()).emit("receiveMessage", savedMessage);

      // Émettre à l’expéditeur
      io.to(senderId.toString()).emit("messageSent", savedMessage);

    } catch (error) {
      console.error("❌ Erreur insertion message BDD :", error);
      socket.emit("errorMessage", { error: "Erreur serveur lors de l'envoi du message." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Utilisateur déconnecté : ${socket.id}`);
  });
});

// === Lancement du serveur ===
server.listen(port, () => {
  console.log(`✅ Serveur démarré avec Socket.io : http://localhost:${port}`);
});
