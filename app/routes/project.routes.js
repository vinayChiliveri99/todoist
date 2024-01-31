const projectController = require('../controllers/projectController');
const authJwt = require('../middlewares/authJwt');
const projectValidator = require('../validations/projectValidator');

const router = require('express').Router();

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// create a project.
router.post(
  '/projects',
  projectValidator,
  authJwt.verifyToken,
  projectController.addProject
);

// get all projects.
router.get(
  '/projects',
  authJwt.verifyToken,
  projectController.getProjects
);

// get a single project with id.
router.get(
  '/projects/:id',
  authJwt.verifyToken,
  projectController.getProject
);

// update a project with id.
router.put(
  '/projects/:id',
  projectValidator,
  authJwt.verifyToken,
  projectController.updateProject
);

// delete a single project with id.
router.delete(
  '/projects/:id',
  authJwt.verifyToken,
  projectController.deleteProject
);

module.exports = router;
