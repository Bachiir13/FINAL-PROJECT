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

// Import pool PostgreSQL
const pool = require("./db");

// Tes routes (pas modifiées)
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

/* Sécurité */
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

/* Routes */
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

/* reCAPTCHA */
app.post('/verify-captcha', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: "Token reCAPTCHA manquant." });

  const secretKey = process.env.RECAPTCHA_SECRET;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await fetch(verificationURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`
    });
    const data = await response.json();

    if (data.success) res.status(200).json({ success: true });
    else res.status(400).json({ success: false, errors: data["error-codes"] });

  } catch (error) {
    console.error("❌ Erreur reCAPTCHA :", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la vérification reCAPTCHA." });
  }
});

/* Serveur HTTP + Socket.io */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`Utilisateur connecté: ${socket.id}`);

  // L'utilisateur rejoint une room correspondant à son userId (string)
  socket.on("joinRoom", (userId) => {
    socket.join(userId.toString());
    console.log(`Utilisateur ${userId} a rejoint sa room.`);
  });

  // Quand un message est envoyé
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    console.log(`Message de ${senderId} à ${receiverId} : ${message}`);

    try {
      // Sauvegarde en base
      const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *`,
        [senderId, receiverId, message]
      );

      const savedMessage = result.rows[0];

      // On émet le message vers la room du destinataire
      io.to(receiverId.toString()).emit("receiveMessage", savedMessage);

      // Et on notifie aussi l'expéditeur que son message a bien été envoyé (utile pour confirmation ou mise à jour UI)
      io.to(senderId.toString()).emit("messageSent", savedMessage);

    } catch (error) {
      console.error("Erreur insertion message BDD :", error);
      socket.emit("errorMessage", { error: "Erreur serveur lors de l'envoi du message." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
  });
});

/* Démarrage serveur */
server.listen(port, () => {
  console.log(`✅ Serveur démarré avec Socket.io : http://localhost:${port}`);
});
