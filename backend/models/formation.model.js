// models/Formation.js
module.exports = (sequelize, DataTypes) => {
  const Formation = sequelize.define('Formation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'formation',
    timestamps: false,
  });

  return Formation;
};
