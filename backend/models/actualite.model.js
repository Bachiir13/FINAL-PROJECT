// models/Actualite.js
module.exports = (sequelize, DataTypes) => {
  const Actualite = sequelize.define('Actualite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_publication: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    auteur_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images_urls: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    },
  }, {
    tableName: 'actualite',
    timestamps: false,
  });

  Actualite.associate = (models) => {
    Actualite.belongsTo(models.User, { foreignKey: 'auteur_id', as: 'auteur' });
  };

  return Actualite;
};
