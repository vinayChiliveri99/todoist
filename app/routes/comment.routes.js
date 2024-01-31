const commentController = require('../controllers/commentController');
const authJwt = require('../middlewares/authJwt');
const commnetValidator = require('../validations/commentValidator');

const router = require('express').Router();

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// get all comments.
router.get(
  '/comments/:taskOrProjectId',
  authJwt.verifyToken,
  commentController.getComments
);

// add comment to a project or a task.
router.post(
  '/comments',
  commnetValidator,
  authJwt.verifyToken,
  commentController.addComment
);

// get a comment using comment id.
router.get(
  '/singlecomment/:id',
  authJwt.verifyToken,
  commentController.getComment
);

// update a comment using comment id.
router.put(
  '/comments/:id',
  commnetValidator,
  authJwt.verifyToken,
  commentController.updateComment
);

// delete a comment using comment id.
router.delete(
  '/comments/:id',
  authJwt.verifyToken,
  commentController.deleteComment
);

module.exports = router;
