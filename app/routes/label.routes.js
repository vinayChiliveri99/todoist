const labelController = require('../controllers/labelController');
const authJwt = require('../middlewares/authJwt');
const labelValidator = require('../validations/labelValidator');

const router = require('express').Router();

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// get all labels.
router.get('/labels', authJwt.verifyToken, labelController.getLabels);

// add label to a project or a task.
router.post(
  '/labels',
  labelValidator,
  authJwt.verifyToken,
  labelController.addLabel
);

// update a label (id provided)
router.put(
  '/labels/:id',
  labelValidator,
  authJwt.verifyToken,
  labelController.updateLabel
);

// delete a label (id privided)
router.delete(
  '/labels/:id',
  authJwt.verifyToken,
  labelController.deleteLabel
);

// get a label (id provided)
router.get(
  '/labels/:id',
  authJwt.verifyToken,
  labelController.getLabel
);

module.exports = router;
