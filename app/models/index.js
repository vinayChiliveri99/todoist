const dbConfig = require('../config/db.config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    // operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

// setting up the db.

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// tables
db.user = require('./user.model')(sequelize, Sequelize);
db.projects = require('./project.model')(sequelize, Sequelize);
db.tasks = require('./task.model')(sequelize, Sequelize);
db.comments = require('./comment.model')(sequelize, Sequelize);
db.labels = require('./label.model')(sequelize, Sequelize);

// sync the database  - creating
// inside sync - if force is true, it drops the table if it exists, and then creates a new table.

db.sequelize
  .sync({ force: true })
  .then(() => console.log('DataBase synced!!'))
  .catch((err) =>
    console.log('Failed to sync database', err.message)
  );

// one to many association between user and projects
db.user.hasMany(db.projects);
db.projects.belongsTo(db.user);

// one to many association between project and tasks.
// one user => many projects
// each project => many tasks
// if a project got deleted, all related tasks will also get deleted
db.projects.hasMany(db.tasks, { onDelete: 'CASCADE' });
db.tasks.belongsTo(db.projects);

db.tasks.belongsTo(db.user, { foreignKey: 'creator_id' });

// one user can have multiple tasks.
// one user => many tasks.
// db.user.hasMany(db.tasks, { foreignKey: 'creator_id' });
// db.tasks.belongsTo(db.user, { foreignKey: 'creator_id' });

// one project can have multiple comments.
// one to many relation, foreignkey called projectId will be created
db.projects.hasMany(db.comments, { onDelete: 'CASCADE' });
db.comments.belongsTo(db.projects);

// one task can have multiple comments.
// one to many relationship, foreignkey called taskId will be created

db.tasks.hasMany(db.comments, { onDelete: 'CASCADE' });
db.comments.belongsTo(db.tasks);

db.comments.belongsTo(db.user, { foreignKey: 'creator_id' });

// one user can have many labels.
// one to many relationship

db.user.hasMany(db.labels);
db.labels.belongsTo(db.user);

module.exports = db;
