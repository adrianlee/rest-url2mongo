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
        }
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        body.should.equal("Not Authenticated, Unable to find user")
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
        }
      };

      request(options, function (err, res, body) {
        if (err) return done(err);
        body.should.equal("Not Authenticated, Wrong Password")
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
    it('...', function(done) {
      done();
    });
  });

  describe('Documents', function() {
    it('...', function(done) {
      done();
    });
  });

  describe('Queries', function() {
    it('...', function(done) {
      done();
    });
  });

});