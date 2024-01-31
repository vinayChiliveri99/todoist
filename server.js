const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./app/controllers/logger');
const expressWinston = require('express-winston');

dotenv.config();

const app = express();

var corsOption = {
  origin: 'http://localhost:8081',
};

// middlewares

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for logging
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

// routes

const authRouter = require('./app/routes/auth.routes');
app.use('/api', authRouter);

const router = require('./app/routes/project.routes');
app.use('/api', router);

const taskRouter = require('./app/routes/task.routes');
app.use('/api', taskRouter);

const commentRouter = require('./app/routes/comment.routes');
app.use('/api', commentRouter);

const labelRouter = require('./app/routes/label.routes');
app.use('/api', labelRouter);

// testing the app, with simple get request to root '/'

// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to express' });
// });

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
