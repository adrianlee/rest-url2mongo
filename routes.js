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

//////////////////////////////////////////////////
// User
//////////////////////////////////////////////////

routes.retrieve_documents = function (req, res) {
  console.log(req.param('collection'));

  mongo.get(req.param('collection'))
    .find({})
    .exec(function (err, doc) {
      if (err) return res.json(404, { error: err });

      if (!doc) return res.json(404, { error: "Document Not found" });

      res.json(200, doc);
    });
};

routes.retrieve_docuemnts_by_id = function (req, res) {
  console.log(req.param('collection'));
  console.log(req.param('id'));

  mongo.get(req.param('collection'))
    .findById(req.param('id'))
    .exec(function (err, doc) {
      if (err) return res.json(404, { error: err });

      if (!doc) return res.json(404, { error: "Document Not found" });

      res.json(200, doc);
    });
};

routes.create_document = function (req, res) {
  console.log(req.param('collection'));

  var newDoc = mongo.get(req.param('collection'))(req.body);

  newDoc.save(function (err, doc) {
    if (err) return res.json(500, { error: err });

    res.json(201, doc);
  });
};

routes.update_document = function (req, res) {
  console.log(req.param('collection'));
  console.log(req.param('id'));

  mongo.get(req.param('collection'))
    .update({ _id: req.param('id') }, req.body, { upsert: true }, function (err, num, doc) {
      if (err) return res.json(404, { error: err });

      if (!num || !doc) {
        return res.json(404, { error: "Unable to find doc" });
      }

      res.json(202, doc);
    });
};

routes.delete_document = function (req, res) {
  console.log(req.param('collection'));
  console.log(req.param('id'));

  // Delete Document
  mongo.get(req.param('collection')).findByIdAndRemove(req.param('id'), function (err, doc) {
    if (err) return res.json(404, { error: err });
    res.json(200);
  });
};

routes.delete_documents = function (req, res) {
  console.log(req.param('collection'));

  // Delete Collection
  mongo.get(req.param('collection')).remove({}, function (err) {
    if (err) return res.json(404, { error: err });
    res.json(200);
  });
};

