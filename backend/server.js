/*******************************
 *  server.js  (backend root)
 *******************************/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const contactRoutes     = require("./routes/contacts.routes");
const actualiteRoutes   = require("./routes/actualite.routes");
const coursRoutes       = require("./routes/cours.routes");
const formationRoutes   = require("./routes/formation.routes");
const inscriptionRoutes = require("./routes/inscription.routes");
const pedagogieRoutes   = require("./routes/pedagogie.routes");
const userRoutes        = require("./routes/user.routes");
const temoignageRoutes  = require("./routes/temoignage.routes");
const inscriptionFormationRoutes = require('./routes/inscriptionformation.routes'); // corrigé ici

const app  = express();
const port = process.env.PORT || 3001;

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(bodyParser.json());

/* ---------- PostgreSQL ---------- */
const { Pool } = require("pg");
const pool = new Pool({
  user:     process.env.PGUSER,
  host:     process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port:     process.env.PGPORT,
});

pool.connect()
  .then(() => console.log("✅ Connecté à PostgreSQL"))
  .catch(err => console.error("❌ Erreur PostgreSQL :", err));

/* Pour partager le pool avec tes contrôleurs via require */
module.exports = { pool };

/* ---------- Routes ---------- */
app.get("/", (_, res) => res.send("🚀 API TechEcole en ligne"));

app.use("/contacts",     contactRoutes);
app.use("/actualites",   actualiteRoutes);
app.use("/cours",        coursRoutes);
app.use("/formations",   formationRoutes);
app.use("/inscriptions", inscriptionRoutes);
app.use("/pedagogies",   pedagogieRoutes);
app.use("/users",        userRoutes);
app.use("/temoignages",  temoignageRoutes);
app.use('/inscriptionformations', inscriptionFormationRoutes);  // et ici aussi

/* ---------- Démarrage ---------- */
app.listen(port, () => {
  console.log(`✅ Serveur démarré : http://localhost:${port}`);
});
