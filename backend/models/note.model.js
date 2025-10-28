// models/Note.js
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eleve_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enseignant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valeur: {
      type: DataTypes.DECIMAL,
      validate: { min: 0 },
    },
    max_note: {
      type: DataTypes.INTEGER,
      validate: { isIn: [[10, 20]] },
    },
    commentaire: {
      type: DataTypes.TEXT,
    },
    date_note: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    matiere: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'note',
    timestamps: false,
  });

  return Note;
};
