// models/InscriptionCours.js
module.exports = (sequelize, DataTypes) => {
  const InscriptionCours = sequelize.define('InscriptionCours', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eleve_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cours_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date_inscription: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'inscription_cours',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['eleve_id', 'cours_id']
      }
    ]
  });

  return InscriptionCours;
};
