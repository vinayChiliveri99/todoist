module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define('label', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: 'charcoal',
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_favourite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Label;
};
