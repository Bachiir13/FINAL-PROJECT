require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Connexion à PostgreSQL
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    logging: false,
  }
);

// === Import des modèles ===
const User = require('./user.model')(sequelize, DataTypes);
const Actualite = require('./actualite.model')(sequelize, DataTypes);
const Contact = require('./contact.model')(sequelize, DataTypes);
const Cours = require('./cours.model')(sequelize, DataTypes);
const Formation = require('./formation.model')(sequelize, DataTypes);
const InscriptionCours = require('./inscription_cours.model')(sequelize, DataTypes);
const InscriptionFormation = require('./inscriptionformation.model')(sequelize, DataTypes);
const Message = require('./message.model')(sequelize, DataTypes);
const Note = require('./note.model')(sequelize, DataTypes);
const Pedagogie = require('./pedagogie.model')(sequelize, DataTypes);
const Temoignages = require('./temoignages.model')(sequelize, DataTypes);

// === Associations ===

// Actualite
Actualite.belongsTo(User, { foreignKey: 'auteur_id', as: 'auteur' });
User.hasMany(Actualite, { foreignKey: 'auteur_id', as: 'actualites' });

// Cours
Cours.belongsTo(User, { foreignKey: 'user_id', as: 'enseignant' });
User.hasMany(Cours, { foreignKey: 'user_id', as: 'cours' });

// InscriptionCours
InscriptionCours.belongsTo(User, { foreignKey: 'eleve_id', as: 'eleve' });
InscriptionCours.belongsTo(Cours, { foreignKey: 'cours_id', as: 'cours' });
User.hasMany(InscriptionCours, { foreignKey: 'eleve_id', as: 'inscriptionsCours' });
Cours.hasMany(InscriptionCours, { foreignKey: 'cours_id', as: 'inscriptions' });

// InscriptionFormation
InscriptionFormation.belongsTo(User, { foreignKey: 'visiteur_id', as: 'visiteur' });
InscriptionFormation.belongsTo(Formation, { foreignKey: 'formation_id', as: 'formation' });
User.hasMany(InscriptionFormation, { foreignKey: 'visiteur_id', as: 'inscriptionsFormation' });
Formation.hasMany(InscriptionFormation, { foreignKey: 'formation_id', as: 'inscriptions' });

// Message
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });

// Note
Note.belongsTo(User, { foreignKey: 'eleve_id', as: 'eleve' });
Note.belongsTo(User, { foreignKey: 'enseignant_id', as: 'enseignant' });
User.hasMany(Note, { foreignKey: 'eleve_id', as: 'notes' });
User.hasMany(Note, { foreignKey: 'enseignant_id', as: 'notesDonnees' });

// Pedagogie
Pedagogie.belongsTo(User, { foreignKey: 'auteur_id', as: 'auteur' });
User.hasMany(Pedagogie, { foreignKey: 'auteur_id', as: 'pedagogies' });

// Export
module.exports = {
  sequelize,
  User,
  Actualite,
  Contact,
  Cours,
  Formation,
  InscriptionCours,
  InscriptionFormation,
  Message,
  Note,
  Pedagogie,
  Temoignages,
};
