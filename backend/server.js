require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const contactRoutes = require("./routes/contacts.routes");
const actualiteRoutes = require("./routes/actualite.routes");
const coursRoutes = require("./routes/cours.routes");
const formationRoutes = require("./routes/formation.routes");
const inscriptionRoutes = require("./routes/inscription.routes");
const pedagogieRoutes = require("./routes/pedagogie.routes");
const userRoutes = require("./routes/user.routes");
const temoignageRoutes = require("./routes/temoignage.routes");
const inscriptionFormationRoutes = require('./routes/inscriptionformation.routes');

const app = express();
const port = process.env.PORT || 3001;

/* ---------- Middlewares ---------- */
app.use(cors());
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

/* ---------- Démarrage du serveur ---------- */
app.listen(port, () => {
  console.log(`✅ Serveur démarré : http://localhost:${port}`);
});
