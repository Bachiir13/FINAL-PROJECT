// models/Cours.js
module.exports = (sequelize, DataTypes) => {
  const Cours = sequelize.define('Cours', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fichier: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'cours',
    timestamps: false,
  });

  return Cours;
};
