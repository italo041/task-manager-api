"use strict";

var express = require('express');

require('./db/mongoose');

var userRouter = require('./routers/user');

var taskRouter = require('./routers/task');

var app = express();
var port = process.env.PORT;
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port, function () {
  console.log('Server is up on port ' + port);
});