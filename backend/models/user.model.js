// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
    },
    prenom: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    mot_de_passe: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'visiteur',
      validate: {
        isIn: [['admin', 'eleve', 'enseignant', 'visiteur']],
      },
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    uid: {
      type: DataTypes.STRING(128),
      unique: true,
    },
    filiere: {
      type: DataTypes.STRING(100),
      validate: {
        isIn: [['Cybersecurité', 'Réseaux et Systèmes', 'Développement Web et Mobile', 'Intelligence Artificielle']],
      },
    },
  }, {
    tableName: 'user',
    timestamps: false,
  });

  return User;
};
