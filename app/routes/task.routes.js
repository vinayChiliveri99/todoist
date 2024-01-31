const taskController = require('../controllers/taskController');
const authJwt = require('../middlewares/authJwt');
const taskValidator = require('../validations/taskValidator');

const router = require('express').Router();

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// get all tasks.
router.get('/tasks', authJwt.verifyToken, taskController.getTasks);

//create a task.
router.post(
  '/tasks',
  taskValidator,
  authJwt.verifyToken,
  taskController.createTask
);

// get a single active task, taskid provided, and isCompleted should be false.
router.get('/tasks/:id', authJwt.verifyToken, taskController.getTask);

// updtae a task.
router.put(
  '/tasks/:id',
  taskValidator,
  authJwt.verifyToken,
  taskController.updateTask
);

// close a task
router.put(
  '/tasks/:id/close',
  taskValidator,
  authJwt.verifyToken,
  taskController.closeTask
);

// reopen a task.
router.put(
  '/tasks/:id/reopen',
  taskValidator,
  authJwt.verifyToken,
  taskController.reopenTask
);

// delete a task.
router.delete(
  '/tasks/:id',
  authJwt.verifyToken,
  taskController.deleteTask
);

module.exports = router;
