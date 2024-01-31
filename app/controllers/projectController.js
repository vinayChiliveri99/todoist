const db = require('../models');

const Project = db.projects;
const User = db.user;

// 1. get all projects.

const getProjects = (req, res) => {
  const userId = req.userId;

  //   console.log(userId + ' from get projects');

  Project.findAll({
    where: {
      userId: userId,
    },
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error('Error fetching projects:', err);
      res.status(500).send({
        message: 'Internal server error while fetching projects.',
        error: err.message || 'Unknown error occurred.',
      });
    });
};

// 2. create new project.

const addProject = (req, res) => {
  // validate request
  if (!req.body.name) {
    res.status(400).send({
      message: 'Project name cannot be empty!',
    });
    return;
  }

  // destructure the body.
  const { name, parent_id, color, is_favourite, view_style } =
    req.body;
  //   console.log('User ID is', req.userId);

  // Check if the user exists
  User.findByPk(req.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'User not found',
        });
        return;
      }

      // Project object
      const project = {
        name: name,
        parent_id: parent_id,
        color: color,
        is_favourite: is_favourite,
        view_style: view_style,
        userId: req.userId,
      };

      // Save project in the database
      return Project.create(project, {
        // Only these fields will be considered for create; if other fields are given, they're ignored
        fields: [
          'name',
          'parent_id',
          'color',
          'is_favourite',
          'view_style',
          'userId',
        ],
      });
    })
    .then((data) => {
      return Project.findByPk(data.id);
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while creating the project.',
      });
    });
};

// 3. get a single project (id) provided

const getProject = (req, res) => {
  // validate the request.
  const projectId = req.params.id;

  if (!projectId) {
    res.status(400).send({
      message: 'Project id cannot be empty!',
    });
    return;
  }

  // Get the user ID from the token
  const userId = req.userId;

  // Check if the user exists
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found.',
        });
      }

      // Check if the project exists
      Project.findOne({
        where: { id: projectId, userId: userId },
      })
        .then((project) => {
          if (!project) {
            res.status(404).send({
              message: 'Project not found!',
            });
            return;
          }

          res.status(200).send(project);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send({
            message: error || 'Internal Server Error',
          });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        message: error || 'Internal Server Error',
      });
    });
};

// 4. update a project.

const updateProject = (req, res) => {
  // validate the request.
  const projectId = req.params.id;

  if (!projectId) {
    res.status(400).send({
      message: 'Project id cannot be empty!',
    });
    return;
  }

  const updateObject = {
    name: req.body.name,
    color: req.body.color,
    is_favourite: req.body.is_favourite,
    view_style: req.body.view_style,
  };

  const userId = req.userId;

  Project.update(updateObject, {
    // only these fields will be considered for create, if other fields given they're ignored
    fields: ['name', 'color', 'is_favourite', 'view_style'],
    where: { id: projectId, userId: userId },
  })
    .then((project) => {
      if (project == 1) {
        Project.findByPk(projectId).then((updatedProject) =>
          res.status(200).send(updatedProject)
        );
      } else {
        res.status(400).json({
          message: `No project found with give project id ${projectId}`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: `Error updating project with ${projectId}`,
      })
    );
};

// 5. delete a project

const deleteProject = (req, res) => {
  // validate the request.

  const projectId = req.params.id;
  const userId = req.userId;

  if (!projectId) {
    res.status(400).send({
      message: 'project id cannot be empty!!',
    });
    return;
  }

  // destroy the project with the given id.

  Project.destroy({ where: { id: projectId, userId: userId } })
    .then((num) => {
      if (num == 1) {
        res.status(204).send({});
      } else {
        res.status(500).json({
          message: `cannot delete project or no project found with ${projectId}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `cannot delete or project not found with ${projectId}`,
      });
    });
};

module.exports = {
  addProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
