module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'task',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      // project_id: {
      //   type: DataTypes.STRING,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      labels: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      parent_id: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          notEmpty: true,
        },
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          isIn: [[1, 2, 3, 4]],
          notEmpty: true,
        },
      },
      due: {
        type: DataTypes.JSONB,
        defaultValue: 'null',
        validate: {
          notEmpty: true,
        },
      },
      url: {
        type: DataTypes.STRING,
      },
      comment_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        // we dont know this as of now.
        type: DataTypes.DATE,
      },
      // creator_id: { this is the userid, which we get as a foreign key
      //   // we dont know this as of now.
      //   type: DataTypes.STRING,
      // },
      assignee_id: {
        type: DataTypes.STRING,
      },
      assigner_id: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.JSONB,
        defaultValue: 'null',
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: false,
    }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.Project, {
      foreignKey: 'project_id',
      as: 'project',
      onDelete: 'CASCADE',
    });

    Task.hasMany(models.Comment, { foreignKey: 'task_id' });
  };

  return Task;
};
