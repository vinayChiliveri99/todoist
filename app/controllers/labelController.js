const db = require('../models');
const Label = db.labels;
const User = db.user;

// 1. get all labels.

const getLabels = (req, res) => {
  const userId = req.userId;
  Label.findAll({
    where: {
      userId: userId,
    },
  })
    .then((data) => res.status(200).send(data))
    .catch((err) =>
      res.status(400).send({
        message:
          err.message ||
          'Some error occured while getting the labels.',
      })
    );
};

// 2. create a label

const addLabel = (req, res) => {
  // validate request
  if (!req.body.name) {
    res.status(400).send({
      message: 'label name cannot be empty!',
    });
    return;
  }

  // destructure the body.
  const { name, order, color, is_favourite } = req.body;

  User.findByPk(req.userId).then((user) => {
    if (!user) {
      res.status(404).send({
        message: 'User not found',
      });
      return;
    }

    // label object
    const labelObject = {
      name,
      color,
      is_favourite,
      order,
      userId: req.userId,
    };

    // save label in the database
    Label.create(labelObject, {
      // only these fields will be considered for create, if other fields given they're ignored
      fields: ['name', 'color', 'is_favourite', 'order', 'userId'],
    })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            'Some error occurred while creating the label.',
        });
      });
  });
};

// 3. update a label

const updateLabel = (req, res) => {
  // validate the request.
  const labelId = req.params.id;
  const userId = req.userId;
  const { name, color, is_favourite, order } = req.body;

  if (!labelId) {
    res.status(400).send({
      message: 'label id cannot be empty!',
    });
    return;
  }

  const updateObject = { name, order, color, is_favourite };

  Label.update(updateObject, {
    // only these fields will be considered for update, if other fields given they're ignored
    fields: ['name', 'color', 'is_favourite', 'order'],
    where: { id: labelId, userId: userId },
  })
    .then((label) => {
      if (label == 1) {
        Label.findByPk(labelId).then((updatedLabel) =>
          res.status(200).send(updatedLabel)
        );
      } else {
        res.status(400).json({
          message: `No label found with give label id ${labelId}`,
        });
      }
    })
    .catch((err) =>
      res.status(500).send({
        message: `Error updating label with ${labelId}`,
      })
    );
};

// 4. delete a project

const deleteLabel = (req, res) => {
  // validate the request.

  const labelId = req.params.id;
  const userId = req.userId;

  if (!labelId) {
    res.status(400).send({
      message: 'label id cannot be empty!!',
    });
    return;
  }

  // destroy the label with the given id.

  Label.destroy({ where: { id: labelId, userId: userId } })
    .then((num) => {
      if (num == 1) {
        res.status(204).send({});
      } else {
        res.status(500).json({
          message: `cannot delete label or no label found with ${labelId}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `cannot delete or label not found with ${labelId}`,
      });
    });
};

// 5. get a single label

const getLabel = (req, res) => {
  // validate the request.
  const labelId = req.params.id;
  const userId = req.userId;

  if (!labelId) {
    res.status(400).send({
      message: 'label id cannot be empty!',
    });
    return;
  }

  User.findByPk(userId).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: 'User not found.',
      });
    }

    Label.findOne({
      where: { id: labelId, userId: userId },
    })
      .then((label) => {
        if (!label) {
          res.status(404).send({
            message: 'No label found!',
          });
          return;
        }

        res.status(200).send(label);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({
          message: 'Internal Server Error',
        });
      });
  });
};

module.exports = {
  getLabels,
  addLabel,
  updateLabel,
  deleteLabel,
  getLabel,
};
