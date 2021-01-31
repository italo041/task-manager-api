"use strict";

var express = require('express');

var User = require('../models/user');

var auth = require('../middleware/auth');

var multer = require('multer');

var sharp = require('sharp');

var _require = require('../emails/account'),
    sendWelcomeEmail = _require.sendWelcomeEmail,
    sendCancelationEmail = _require.sendCancelationEmail;

var router = express.Router();
router.post('/users', function _callee(req, res) {
  var user, token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = new User(req.body);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(user.save());

        case 4:
          sendWelcomeEmail(user.email, user.name);
          _context.next = 7;
          return regeneratorRuntime.awrap(user.generateAuthToken());

        case 7:
          token = _context.sent;
          res.status(201).send({
            user: user,
            token: token
          });
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          res.status(400).send(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
router.post('/users/login', function _callee2(req, res) {
  var user, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findByCredentials(req.body.email, req.body.password));

        case 3:
          user = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(user.generateAuthToken());

        case 6:
          token = _context2.sent;
          res.send({
            user: user,
            token: token
          });
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          res.status(400).send(_context2.t0);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/users/logout', auth, function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          req.user.tokens = req.user.tokens.filter(function (token) {
            return token.token !== req.token;
          });
          _context3.next = 4;
          return regeneratorRuntime.awrap(req.user.save());

        case 4:
          res.send();
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).send(_context3.t0);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/users/logoutAll', auth, function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          req.user.tokens = [];
          _context4.next = 4;
          return regeneratorRuntime.awrap(req.user.save());

        case 4:
          res.send();
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).send(_context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/users/me', auth, function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          try {
            res.send(req.user);
          } catch (error) {
            res.send(error);
          }

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
});
router.get('/users/:id', function _callee6(req, res) {
  var _id, user;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _id = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findById(_id));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).send());

        case 7:
          res.send(user);
          _context6.next = 13;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](1);
          res.status(500).send();

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
router.patch('/users/me', auth, function _callee7(req, res) {
  var updates, allowedUpdates, isValidOperation;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          updates = Object.keys(req.body);
          allowedUpdates = ['name', 'email', 'password', 'age'];
          isValidOperation = updates.every(function (update) {
            return allowedUpdates.includes(update);
          });

          if (isValidOperation) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", res.status(400).send({
            error: 'Invalid updates'
          }));

        case 5:
          _context7.prev = 5;
          updates.forEach(function (update) {
            return req.user[update] = req.body[update];
          });
          _context7.next = 9;
          return regeneratorRuntime.awrap(req.user.save());

        case 9:
          res.send(req.user);
          _context7.next = 15;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](5);
          res.status(400).send(_context7.t0);

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[5, 12]]);
});
router.get('/users', auth, function _callee8(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(User.find({}));

        case 3:
          users = _context8.sent;
          res.send(users);
          _context8.next = 10;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          res.status(500).send();

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router["delete"]('/users/me', auth, function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(req.user.remove());

        case 3:
          sendCancelationEmail(req.user.email, req.user.name);
          res.send(req.user);
          _context9.next = 10;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          res.status(500).send();

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
var upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter: function fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only allow jpg, jpeg, png'));
    }

    cb(undefined, true);
  }
});
router.post('/users/me/avatar', auth, upload.single('upload'), function _callee10(req, res) {
  var buffer;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize({
            width: 250,
            height: 250
          }).png().toBuffer());

        case 2:
          buffer = _context10.sent;
          req.user.avatar = buffer; // req.user.avatar = req.file.buffer

          _context10.next = 6;
          return regeneratorRuntime.awrap(req.user.save());

        case 6:
          res.send();

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
}, function (error, req, res, next) {
  res.status(400).send({
    error: error.message
  });
});
router["delete"]('/users/me/avatar', auth, function _callee11(req, res) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          req.user.avatar = undefined;
          _context11.next = 3;
          return regeneratorRuntime.awrap(req.user.save());

        case 3:
          res.send();

        case 4:
        case "end":
          return _context11.stop();
      }
    }
  });
});
router.get('/users/:id/avatar', function _callee12(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 3:
          user = _context12.sent;

          if (!(!user || !user.avatar)) {
            _context12.next = 6;
            break;
          }

          return _context12.abrupt("return", new Error(''));

        case 6:
          res.set('Content-Type', 'image/png');
          res.send(user.avatar);
          _context12.next = 13;
          break;

        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](0);
          res.status(404).send();

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;