// models/Temoignages.js
module.exports = (sequelize, DataTypes) => {
  const Temoignages = sequelize.define('Temoignages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    promo: {
      type: DataTypes.STRING(50),
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.TEXT,
    },
    date_post: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'temoignages',
    timestamps: false,
  });

  return Temoignages;
};
