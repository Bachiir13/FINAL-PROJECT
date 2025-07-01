const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Tes routes existantes
app.use('/users', require('./routes/user.routes'));
app.use('/actualites', require('./routes/actualite.routes'));
app.use('/pedagogies', require('./routes/pedagogie.routes'));
app.use('/cours', require('./routes/cours.routes'));
app.use('/formations', require('./routes/formation.routes'));
app.use('/inscriptions', require('./routes/inscription.routes'));
app.use('/contacts', require('./routes/contact.routes'));
app.use('/temoignages', require('./routes/temoignage.routes'));


app.listen(3001, () => {
  console.log('✅ Serveur démarré sur http://localhost:3001');
});
