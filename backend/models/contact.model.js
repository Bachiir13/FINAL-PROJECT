// models/Contact.js
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_envoi: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'contact',
    timestamps: false,
  });

  return Contact;
};
