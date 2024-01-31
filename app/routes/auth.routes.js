const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const {
  userSignupValidator,
  userLoginValidator,
} = require('../validations/userValidator');

const {
  checkDuplicateUsernameOrEmail,
} = require('../middlewares/verifySignUp');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token,Origin,Content-Type,Accept'
  );
  next();
});

router.post(
  '/signup',
  userSignupValidator,
  checkDuplicateUsernameOrEmail,
  authController.signup
);
router.post('/signin', userLoginValidator, authController.signin);
module.exports = router;
