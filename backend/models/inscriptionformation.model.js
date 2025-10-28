// models/InscriptionFormation.js
module.exports = (sequelize, DataTypes) => {
  const InscriptionFormation = sequelize.define('InscriptionFormation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    formation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visiteur_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_inscription: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'inscriptionformation',
    timestamps: false,
  });

  return InscriptionFormation;
};
