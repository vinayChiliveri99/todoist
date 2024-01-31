const db = require('../models');
const { Op } = require('sequelize');

const Task = db.tasks;
const Project = db.projects;

// 1. get all active tasks.

const getTasks = (req, res) => {
  const userId = req.userId;

  console.log(userId + ' from get tasks');
  // adding an extra filter, to show only tasks which are not completed yet

  Task.findAll({
    where: {
      is_completed: false,
      projectId: req.body.project_id,
      creator_id: userId,
    },
  })
    .then((data) => res.status(200).send(data))
    .catch((err) =>
      res.status(400).send({
        message:
          err.message ||
          'Some error occured while getting the tasks.',
      })
    );
};

// 2. Create a new task.

const createTask = (req, res) => {
  // Extracting JSON body parameters from the request

  const userId = req.userId;

  const {
    content,
    description,
    project_id,
    parent_id,
    order,
    labels,
    priority,
    due_date,
    due_string,
    is_recurring,
    due_datetime,
    duration,
    duration_unit,
  } = req.body;

  // validate the content.
  if (!content) {
    res.status(400).send({
      message: 'Content cannot be empty!',
    });
    return;
  }

  //   Validate if the project_id exists
  Project.findByPk(project_id)
    .then((project) => {
      if (!project) {
        res.status(404).send({
          message: `No such project found, check if project exist before adding the task.`,
        });
        return;
      }

      // Check if the current user is the owner or creator of the project
      //   console.log(project);
      if (project.userId !== userId) {
        res.status(403).send({
          message: `You do not have permission to create a task in this project.`,
        });
        return;
      }

      const task = {
        content,
        description,
        projectId: project_id,
        parent_id,
        order,
        labels,
        priority,
        due: {
          string: due_string,
          date: due_date,
          datetime: due_datetime,
          isRecurring: is_recurring,
        },
        duration: {
          amount: duration,
          unit: duration_unit,
        },
        creator_id: userId,
      };

      // Creating a new task
      Task.create(task, {
        fields: [
          'content',
          'description',
          'projectId',
          'parent_id',
          'order',
          'labels',
          'priority',
          'due',
          'assignee_id',
          'duration',
          'duration_unit',
          'creator_id',
        ],
      })
        .then((newTask) => res.status(200).json(newTask))
        .catch((err) =>
          res.status(400).send({
            message:
              err.message ||
              'Some error occurred while creating the task.',
          })
        );
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: 'Internal server error.' + err,
      });
    });
};

// 3. get an active task.
// returns a single task (taskid provided) where isCompleted is false.

const getTask = (req, res) => {
  // validate the request.
  const taskId = req.params.id;
  const userId = req.userId;

  if (!taskId) {
    res.status(400).send({
      message: 'task id cannot be empty!',
    });
    return;
  }

  Task.findOne({
    where: { id: taskId, creator_id: userId },
  })
    .then((task) => {
      if (!task) {
        res.status(404).send({
          message: 'No task found!',
        });
        return;
      }

      // check is_completed is false
      if (task.is_completed === false) {
        res.status(200).send(task);
      } else {
        res.json({
          message: 'task is already completed or not found',
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        message: 'Internal Server Error',
      });
    });
};

// 4. update a task.

const updateTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  if (!taskId) {
    res.status(400).send({
      message: 'task id cannot be empty!',
    });
    return;
  }

  const {
    content,
    description,
    labels,
    priority,
    due_string,
    due_date,
    due_datetime,
    duration,
    duration_unit,
  } = req.body;

  const updateObject = {
    content,
    description,
    labels,
    priority,
    due_string,
    due_date,
    due_datetime,
    duration,
    duration_unit,
  };

  Task.update(updateObject, {
    fields: [
      'content',
      'description',
      'labels',
      'priority',
      'due_string',
      'due_date',
      'due_datetime',
      'duration',
      'duration_unit',
    ],
    where: { id: taskId, creator_id: userId },
  })
    .then((task) => {
      if (task == 1) {
        Task.findByPk(taskId).then((updatedTask) =>
          res.status(200).send(updatedTask)
        );
      } else {
        res.status(400).json({
          message: `No task found with the given task ID ${taskId} or you do not have permission to update it.`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: `Error updating task with ${taskId}`,
      })
    );
};

// 5. close a task.
const closeTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  if (!taskId) {
    res.status(400).send({
      message: 'Task id cannot be empty!',
    });
    return;
  }

  Task.update(
    { is_completed: true },
    {
      // check task is not already completed
      where: { id: taskId, is_completed: false, creator_id: userId },
    }
  )
    .then((result) => {
      if (result == 1) {
        res.status(204).send();
      } else {
        res.status(404).json({
          message: `No active task found with the given task ID ${taskId} or you do not have permission to close it.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: `Error closing task with ${taskId}`,
      });
    });
};

// 6. reopen a task.

const reopenTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  if (!taskId) {
    res.status(400).send({
      message: 'Task id cannot be empty!',
    });
    return;
  }

  // Update the task and its ancestors to mark them as uncompleted
  Task.update(
    { is_completed: false },
    {
      where: {
        [Op.or]: [
          // Update the task itself
          { id: taskId, creator_id: userId },
          // Update its ancestors
          { parent_id: taskId },
        ],
      },
    }
  )
    .then((result) => {
      if (result == 1) {
        res.status(204).send();
      } else {
        res.status(404).json({
          message: `No task found with the given task ID ${taskId} or you do not have permission to reopen it.`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: `Error reopening task with ${taskId}`,
      })
    );
};

// 7. delete a task.

const deleteTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  if (!taskId) {
    res.status(400).send({
      message: 'task id cannot be empty!!',
    });
    return;
  }

  // destroy the project with the given id.

  Task.destroy({ where: { id: taskId, creator_id: userId } })
    .then((num) => {
      if (num == 1) {
        res.status(204).send();
      } else {
        res.status(500).json({
          message: `Cannot delete task or no task found with ID ${taskId}, or you do not have permission to delete it.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: `cannot delete or task not found with ${taskId}`,
      });
    });
};

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  closeTask,
  reopenTask,
  deleteTask,
};
