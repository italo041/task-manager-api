"use strict";

var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    "default": false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});
var Task = mongoose.model('Task', taskSchema);
module.exports = Task;