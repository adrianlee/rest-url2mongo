var mongo = require('./mongo');

module.exports = routes = {};

//////////////////////////////////////////////////
// General
//////////////////////////////////////////////////

routes.index = function (req, res) {
  // res.json({ msg: 'hello world', session: req.cookies.ecse489 || {} });
  res.json({ msg: 'hello world' });
};

routes.logout = function (req, res) {
  res.clearCookie('ecse489');

  // 200 OK
  res.json(200, { msg: 'logged out' });
};

//////////////////////////////////////////////////
// User
//////////////////////////////////////////////////

routes.user_listAll = function (req, res) {
  mongo.get('User')
    .find({})
    .select('-password -__v')
    .exec(function (err, doc) {
      if (err) return res.json(500, err);
      console.log(err);
      console.log(doc);

      // 200 OK
      res.json(200, doc);
    });
};

routes.user_getByUsername = function (req, res) {
  mongo.get('User')
    .findOne({ username: req.param('username')})
    .select('-password -__v')
    .exec(function (err, doc) {
      if (err) return res.json(500, err);
      console.log(err);
      console.log(doc);

      if (!doc) {
        return res.json(404, { error: "User doesn't exist" });
      }

      // 200 OK
      res.json(200, doc);
    });
};

routes.user_create = function (req, res) {
  if (!req.param('username') || !req.param('password')) {
    // 400 Bad Request
    return res.json(400, { error: "Missing Username Or Password fields" });
  }

  mongo.get('User').findOne({ username: req.param('username')}, function (err, doc) {
    if (!doc) {
      var newUser = new mongo.get('User')();

      newUser.set('username', req.param('username'));
      newUser.set('password', req.param('password'));
      newUser.set('is_admin', req.param('is_admin') || false);

      newUser.save(function (err, doc) {
        if (err) return res.json(500, err);
        console.log(err);

        // 201 Created
        return res.json(201, doc);
      });
    } else {
      // 403 Forbidden
      return res.json(403, { error: "Username already taken" });
    }
  });
};

routes.user_delete = function (req, res) {
  mongo.get('User')
    .findOneAndRemove({ username: req.param('username')})
    .exec(function (err, doc) {
      if (err) return res.json(err);

      if (doc) {
        return res.json(200, doc);
      }

      res.json(404, { error: "User doesn't exist" })
    });
};

routes.user_update = function (req, res) {
  console.log('updating ' + req.param('username'));
  mongo.get('User')
    .findOne({ username: req.param('username')})
    .exec(function (err, doc) {
      if (err) return res.json(500, err);

      if (!doc) {
        // 404 Not Found
        return res.json(404, { error: "User doesn't exist" });
      }

      doc.update(req.body, {}, function (err, doc) {
        if (err) return res.json(500, err);

        // 202 Accepted
        return res.json(202, {});
      });
    });
};
