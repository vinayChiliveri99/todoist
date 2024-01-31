const db = require('../models');
const Project = db.projects;
const Task = db.tasks;

const Comment = db.comments;

// 1. get all comments.

const getComments = (req, res) => {
  const { taskOrProjectId } = req.params;
  const userId = req.userId;

  Comment.findOne({
    where: { projectId: taskOrProjectId, creator_id: userId },
  })
    .then((isProjectId) => {
      let comments;

      if (isProjectId) {
        // Fetch comments based on project ID
        return Comment.findAll({
          where: { projectId: taskOrProjectId, creator_id: userId },
        });
      } else {
        // Fetch comments based on task ID
        return Comment.findAll({
          where: { taskId: taskOrProjectId, creator_id: userId },
        });
      }
    })
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        message: 'Internal Server Error',
      });
    });
};

// 2. create a comment.
// one comment should either belong to a task or a project.
// any one value should be given while creating the comment.

const addComment = (req, res) => {
  // Validate comment
  const { content, taskId, projectId, attachment } = req.body;
  const userId = req.userId;

  if (!content || (taskId && projectId) || (!taskId && !projectId)) {
    res.status(400).send({
      message:
        'Invalid comment data. Content should not be empty, and either taskId or projectId should be present (not both).',
    });
    return;
  }

  let idPromise;

  switch (true) {
    case typeof taskId !== 'undefined' && taskId !== null:
      // If task_id is defined and not null, execute this case
      idPromise = Task.findByPk(taskId);
      break;
    case typeof projectId !== 'undefined' && projectId !== null:
      // If project_id is defined and not null, execute this case
      idPromise = Project.findByPk(projectId);
      break;
    default:
      // If neither task_id nor project_id is defined or not null, execute this case
      idPromise = Promise.resolve(null);
  }

  let createdComment;

  idPromise
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: 'Task or project not found for the given id.',
        });
        return Promise.reject('Task or project not found.');
      }

      //   console.log('result is: ', result);

      let userIdentifierField;

      if (result instanceof Task) {
        userIdentifierField = 'creator_id';
      } else if (result instanceof Project) {
        userIdentifierField = 'userId';
      } else {
        res.status(500).send({
          message: 'Unexpected result type.',
        });
        return Promise.reject('Unexpected result type.');
      }

      if (result[userIdentifierField] !== userId)
        return res.status(403).send({
          message: 'No permission to add a comment with this user.',
        });

      // Comment object
      const commentObject = {
        taskId,
        projectId,
        content,
        attachment,
        creator_id: userId,
      };

      // Save comment in the database
      return Comment.create(commentObject, {
        // Only these fields will be considered for create, if other fields given they're ignored
        fields: [
          'taskId',
          'projectId',
          'content',
          'attachment',
          'creator_id',
        ],
      });
    })
    .then((data) => {
      createdComment = data;

      // Increment comment_count in Task model if task_id is provided
      if (taskId) {
        return Task.increment('comment_count', {
          by: 1,
          where: { id: taskId, creator_id: userId },
        });
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      // Increment comment_count in Project model if project_id is provided
      if (projectId) {
        return Project.increment('comment_count', {
          by: 1,
          where: { id: projectId, userId: userId },
        });
      } else {
        return Promise.resolve();
      }
    })
    .then(() => Comment.findByPk(createdComment.id))
    .then((result) => {
      if (!result) {
        res.status(500).send({
          message: 'Comment not found after creation.',
        });
        return Promise.reject('Comment not found after creation.');
      }
      return res.status(200).send(result);
    })
    .catch((err) => {
      console.error(err);
      if (res.headersSent) {
        console.error(
          'Response headers already sent. Ignoring additional response.'
        );
        return;
      }
    });
};

// 3. get a single comment using comment id.

const getComment = (req, res) => {
  // validate the request.
  const commentId = req.params.id;
  const userId = req.userId;

  if (!commentId) {
    res.status(400).send({
      message: 'comment id cannot be empty!',
    });
    return;
  }

  Comment.findOne({
    where: { id: commentId, creator_id: userId },
  })
    .then((comment) => {
      if (!comment) {
        res.status(404).send({
          message: 'No comment found!',
        });
        return;
      }

      res.status(200).send(comment);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        message: `Internal Server Error while getting the comment with id: ${commentId}`,
      });
    });
};

// 4. update a comment.

const updateComment = (req, res) => {
  const commentId = req.params.id;
  const userId = req.userId;
  const { content } = req.body;

  if (!commentId) {
    res.status(400).send({
      message: 'comment id cannot be empty!',
    });
    return;
  }

  const updateObject = { content };

  Comment.update(updateObject, {
    fields: ['content'],
    where: { id: commentId, creator_id: userId },
  })
    .then((comment) => {
      if (comment == 1) {
        Comment.findByPk(commentId).then((updatedComment) =>
          res.status(200).send(updatedComment)
        );
      } else {
        res.status(400).json({
          message: `No comment found with give comment id ${commentId}`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: `Error updating comment with ${commentId}`,
      })
    );
};

// 5. delete a comment.

const deleteComment = (req, res) => {
  // Validate the request.
  const commentId = req.params.id;
  const userId = req.userId;

  if (!commentId) {
    res.status(400).send({
      message: 'Comment id cannot be empty!!',
    });
    return;
  }

  let commentToDelete;

  // Find the comment before deletion to get task_id and project_id
  Comment.findByPk(commentId)
    .then((comment) => {
      if (!comment) {
        return res.status(404).send({
          message: `No comment found with the given id ${commentId}`,
        });
      }

      commentToDelete = comment;

      // Destroy the comment with the given id.
      return Comment.destroy({
        where: { id: commentId, creator_id: userId },
      });
    })
    .then((num) => {
      if (num == 1) {
        res.status(204).send();
        // Decrement comment_count in Task model if task_id is present
        if (commentToDelete && commentToDelete.task_id) {
          return Task.decrement('comment_count', {
            by: 1,
            where: {
              id: commentToDelete.task_id,
              creator_id: userId,
            },
          });
        } else {
          return Promise.resolve();
        }
      }
    })
    .then(() => {
      // Decrement comment_count in Project model if project_id is present
      if (commentToDelete && commentToDelete.project_id) {
        return Project.decrement('comment_count', {
          by: 1,
          where: { id: commentToDelete.project_id, userId: userId },
        });
      } else {
        return Promise.resolve();
      }
    })
    .catch((err) => {
      console.error(err);
      // Error: Handle the error and send an appropriate response
      if (!res.headersSent) {
        return res.status(500).send({
          message: `Error deleting comment with ${commentId}: ${err.message}`,
        });
      }
    });
};

module.exports = {
  getComments,
  addComment,
  getComment,
  updateComment,
  deleteComment,
};
