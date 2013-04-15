var should = require('should');
var request = require('request');

describe('General', function() {
  describe('Login', function() {

    // Logout after each successful or unsuccessful login.
    afterEach(function (done) {
      request("http://localhost:3000/logout/", { json: true }, function (err, res, body) {
        body.msg.should.equal("logged out");
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('login with invalid username', function(done) {
      var options = {
        url: "http://localhost:3000/",
        auth: {
          user: 'adrian2',
          pass: '123'
        },
        json: true
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        body.error.should.equal("Not Authenticated, Unable to find user")
        res.statusCode.should.equal(500);
        done();
      });
    });

    it('login with wrong password', function(done) {
      var options = {
        url: "http://localhost:3000/",
        auth: {
          user: 'adrian',
          pass: '123s'
        },
        json: true
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        body.error.should.equal("Not Authenticated, Wrong Password")
        res.statusCode.should.equal(500);
        done();
      });
    });

    it('login with admin account', function(done) {
      var options = {
        url: "http://localhost:3000/",
        auth: {
          user: 'adrian',
          pass: '123'
        }
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        // body.should.equal("Not Authenticated, Wrong Password")
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('login with normal account', function(done) {
      var options = {
        url: "http://localhost:3000/",
        auth: {
          user: 'john',
          pass: '123'
        }
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        // body.should.equal("Not Authenticated, Wrong Password")
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('check login set-cookie field in response header', function(done) {
      var options = {
        url: "http://localhost:3000/",
        auth: {
          user: 'john',
          pass: '123'
        }
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        // body.should.equal("Not Authenticated, Wrong Password")
        res.statusCode.should.equal(200);
        res.headers['set-cookie'].should.not.be.empty;
        done();
      });
    });
  });

  describe('User', function() {
    // Log into an admin account
    before(function (done) {
      var options = {
        url: "http://localhost:3000/",
        auth: {
          user: 'adrian',
          pass: '123'
        }
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(200);
        done();
      });

    });

    it('should be able to get list of users', function(done) {
      request("http://localhost:3000/user", { json: true }, function (err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(200);
        body.should.not.be.empty;
        done();
      });
    });

    it('should create a username "hello"', function(done) {
      request.post("http://localhost:3000/user", { json: { username: "hello", password: "123" } }, function (err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(201);
        done();
      });
    });

    it('should not be able to create a user of the same username "hello"', function(done) {
      request.post("http://localhost:3000/user", { json: { username: "hello", password: "123" } }, function (err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(403);
        body.error.should.equal("Username already taken");
        done();
      });
    });

    it('should not be able to update user "asdf"', function(done) {
      request("http://localhost:3000/user/asdf", { method: "PUT", json: { password: "321" } }, function (err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('should be able to update password of user "hello"', function(done) {
      request("http://localhost:3000/user/hello", { method: "PUT", json: { password: "321" } }, function (err, res, body) {
        if (err) return done(err);
        res.statusCode.should.equal(202);
        done();
      });
    });

    it('should be able to delete the username "hello"', function(done) {
      request("http://localhost:3000/user/hello", { method: "DELETE" }, function (err, res, body) {
        body.should.not.be.empty;
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('should not be able to find username "hello" for deletion', function(done) {
      request("http://localhost:3000/user/hello", { method: "DELETE", json: true }, function (err, res, body) {
        body.error.should.equal("User doesn't exist");
        res.statusCode.should.equal(404);
        done();
      });
    });
  });
});


describe('Endpoints', function() {
  describe('Collections', function() {
    it('Get Documents By Collection', function(done) {
      request("http://localhost:3000/omg/", function (err, res, body) {
        // console.log(body); // returns []
        res.statusCode.should.equal(200);
        done();
      });
    });


    it('Create First Document in a \'DELETE\' collection', function(done) {
      var req_body = {};

      request.post("http://localhost:3000/delete/", { json: req_body }, function (err, res, body) {
        // console.log(body); // returns new document object
        body._id.should.be.ok;
        res.statusCode.should.equal(201);
        done();
      });
    });

    it('Create Second Document in a \'DELETE\' collection', function(done) {
      var req_body = {};

      request.post("http://localhost:3000/delete/", { json: req_body }, function (err, res, body) {
        // console.log(body); // returns new document object
        body._id.should.be.ok;
        res.statusCode.should.equal(201);
        done();
      });
    });

    it('Delete all documents in the \'DELETE\' collection', function(done) {
      request("http://localhost:3000/delete", { method: "delete", json: true }, function (err, res, body) {
        // console.log(body); // returns new document object
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('Documents', function() {
    describe('GET', function() {
      it('Get Document By ID that doesn\'t exist', function(done) {
        request("http://localhost:3000/omg/123", { json: true }, function (err, res, body) {
          // console.log(body); // returns error: CastError
          body.error.should.be.ok;
          res.statusCode.should.equal(404);
          done();
        });
      });

      it('Get Document By ID that exist', function(done) {
        request("http://localhost:3000/test/516b492562be100000000002", { json: true }, function (err, res, body) {
          // console.log(body); // returns error: CastError
          body._id.should.be.ok;
          res.statusCode.should.equal(200);
          done();
        });
      });
    });

    describe('CREATE', function() {
      it('Create Document in a \'TEST\' collection', function(done) {
        var req_body = {
          "name": "text1",
          "value": 1,
          "boolean": true
        };

        request.post("http://localhost:3000/test/", { json: req_body }, function (err, res, body) {
          // console.log(body); // returns new document object
          body._id.should.be.ok;
          body.name.should.equal("text1");
          body.value.should.equal(1);
          body.boolean.should.equal(true);
          res.statusCode.should.equal(201);
          done();
        });
      });

      it('Create Document in a \'TEST\' collection w/o body', function(done) {
        var req_body = {};

        request.post("http://localhost:3000/test/", { json: req_body }, function (err, res, body) {
          // console.log(body); // returns new document object
          body._id.should.be.ok;
          should.not.exist(body.name);
          should.not.exist(body.value);
          should.not.exist(body.boolean);
          res.statusCode.should.equal(201);
          done();
        });
      });

      it('Create Document in a \'TEST\' collection w/ specified ID in URL - should fail', function(done) {
        var req_body = {};

        request.post("http://localhost:3000/test/5716938249174", { json: req_body }, function (err, res, body) {
          // console.log(body); // returns new document object
          res.statusCode.should.equal(404);
          done();
        });
      });
    });

    describe('UPDATE', function() {
      it('Update Document in a \'TEST\' collection with wrong ID', function(done) {
        var req_body = {
          "name": "text1",
          "value": 0,
          "boolean": false
        };

        request("http://localhost:3000/test/123", { method: "put", json: req_body }, function (err, res, body) {
          // console.log(body); // returns new document object

          res.statusCode.should.equal(404);
          done();
        });
      });

      it('Update Document in a \'TEST\' collection with right ID', function(done) {
        var req_body = {
          "name": "updated",
          "asdf": "asdf",
          "value": Math.floor(Math.random() * 100),
          "boolean": true
        };

        request("http://localhost:3000/test/516b492562be100000000002", { method: "put", json: req_body }, function (err, res, body) {
          // console.log(body); // returns new document object
          res.statusCode.should.equal(202);
          done();
        });
      });

      xit('Update creates a new Doc if does not exist', function(done) {
        var req_body = {
          "name": "updated",
          "asdf": "asdf",
          "value": Math.floor(Math.random() * 100),
          "boolean": true
        };

        request("http://localhost:3000/test", { method: "put", json: req_body }, function (err, res, body) {
          // console.log(body); // returns new document object
          res.statusCode.should.equal(202);
          done();
        });
      });
    });


    describe('DELETE', function() {
      it('Delete Document in a \'TEST\' collection with wrong ID', function(done) {
        request("http://localhost:3000/test/123", { method: "delete", json: true }, function (err, res, body) {
          // console.log(body); // returns new document object
          res.statusCode.should.equal(404);
          done();
        });
      });

      xit('Delete Document in a \'TEST\' collection with right ID', function(done) {
        request("http://localhost:3000/test/unknown", { method: "delete", json: true }, function (err, res, body) {
          // console.log(body); // returns new document object
          res.statusCode.should.equal(404);
          done();
        });
      });
    });
  });

  describe('Queries', function() {
    it('Query by name', function(done) {
      request("http://localhost:3000/test/?query={\"name\":\"updated\"}", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns new document object
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('Query all', function(done) {
      request("http://localhost:3000/test/?query={}", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns new document object
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('Query Greater than Equal to 10', function(done) {
      request("http://localhost:3000/test/?query={\"value\": { \"$gte\" : 10 } }", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns new document object
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('Query Less than Equal to 50', function(done) {
      request("http://localhost:3000/test/?query={\"value\": { \"$lte\" : 50 } }", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns new document object
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('Dual Query. Less than Equal to 100 & Greater than Equal to 2', function(done) {
      request("http://localhost:3000/test/?query={\"value\": { \"$lte\" : 100, \"$gte\" : 2 } }", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns new document object
        body.length.should.equal(1);
        res.statusCode.should.equal(200);
        done();
      });
    });

    xit('Query. And function', function(done) {
      request("http://localhost:3000/test/?query={\"value\": 1 }", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns new document object
        body.length.should.not.equal(0);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('Sort', function() {
    it('Sort by ID in ascending order', function(done) {
      request("http://localhost:3000/test/?sort={\"value\": \"asc\" }", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns array in acsending order
        should.not.exist(body[0].value);
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('Sort by ID in descending order', function(done) {
      request("http://localhost:3000/test/?sort={\"value\": \"desc\" }", { method: "get", json: true }, function (err, res, body) {
        // console.log(body); // returns array in descending order
        body[0].value.should.equal(1000);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });
});