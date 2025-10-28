// models/Pedagogie.js
module.exports = (sequelize, DataTypes) => {
  const Pedagogie = sequelize.define('Pedagogie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
    fichier_url: {
      type: DataTypes.TEXT,
    },
    auteur_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'pedagogie',
    timestamps: false,
  });

  return Pedagogie;
};
