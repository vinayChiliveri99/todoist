module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    posted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    content: {
      type: DataTypes.TEXT,
    },
    attachment: {
      type: DataTypes.JSONB,
    },
  });

  return Comment;
};
