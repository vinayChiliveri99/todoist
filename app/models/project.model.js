const User = require('../models/user.model');

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: 'charcoal',
      validate: {
        notEmpty: true,
      },
    },
    parent_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        notEmpty: true,
      },
    },
    comment_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_shared: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        notEmpty: true,
      },
    },
    is_favourite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        notEmpty: true,
      },
    },
    is_inbox_project: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true,
      },
      defaultValue: false,
    },
    is_team_inbox: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true,
      },
      defaultValue: false,
    },
    view_style: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isIn: [['list', 'board']],
      },
      defaultValue: 'list',
    },
    // should generate it dynamically
    url: {
      type: DataTypes.STRING,
    },
  });

  // association of project model with task model

  //   Project.associate = (models) => {
  //     Project.belongsTo(models.User, {
  //       foreignKey: 'userid',
  //       sourceKey: 'userid',
  //     });

  //     Project.hasMany(models.Task, {
  //       foreignKey: 'project_id',
  //       as: 'tasks',
  //     });

  //     Project.hasMany(models.Comment, {
  //       foreignKey: 'project_id',
  //       as: 'comments',
  //     });
  //   };

  //   Project.associate = (models) => {
  //     Project.belongsTo(models.User);
  //   };
  return Project;
};
