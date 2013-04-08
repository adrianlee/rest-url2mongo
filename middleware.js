var mongo =  require('./mongo');

module.exports = middleware = {};

// Set-Cookie if user doesn't already have 'ecse489'
middleware.cookieHandler = function (req, res, next) {
  console.log('Cookie Middleware');

  cookie = function(name, val, options){
    var secret = this.req.secret;
    var signed = options.signed;
    if (signed && !secret) throw new Error('connect.cookieParser("secret") required for signed cookies');
    if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
    if (signed) val = 's:' + sign(val, secret);
    if ('maxAge' in options) {
      options.expires = new Date(Date.now() + options.maxAge);
      options.maxAge /= 1000;
    }
    if (null == options.path) options.path = '/';
    this.set('Set-Cookie', cookie.serialize(name, String(val), options));
    return this;
  };

  // Create cookie if cookie doesn't already exist
  if (!req.cookies.ecse489) {
    var key = "ecse489";

    var value = {
      authenticated: false
    };

    // Set the Set-Cookie in Response Header!
    console.log('Set-Cookie: ' + key + '=' + JSON.stringify(value));
    req.cookies.ecse489 = {};
    res.cookie(key, value, { maxAge: 900000, httpOnly: true });
  }

  return next();
};


// Basic Authentication Logic. Looks in headers for login credentials
middleware.basicAuth = function (req, res, next) {
  console.log('Auth Middleware');

  // If not authenticated
  if (req.cookies.ecse489 && !req.cookies.ecse489.authenticated) {
    console.log("not authenticated");

    // GET Auth Header from Request
    var auth = req.get('Authorization');
    if (!auth) return next("Not Authenticated, No Authentication credentials found");

    // Parse Auth Header
    var parts = auth.split(' ');
    if ('basic' != parts[0].toLowerCase()) return next("Not Authenticated, Authentication credentials malformed");
    if (!parts[1]) return next("Not Authenticated, Authentication credentials malformed");
    auth = parts[1];


    // Decode base64 hash for credentials
    auth = new Buffer(auth, 'base64').toString().match(/^([^:]*):(.*)$/);
    if (!auth) return next("Not Authenticated, Authentication credentials malformed");

    // Parse username and password
    var username = auth[1];
    var password = auth[2];

    // Credential Look up
    mongo.get('User').findOne({ username: username}, function (err, doc) {
      console.log('Authenticating...');

      if (doc) {
        console.log('Credentials Match');

        // Set session info in cookie
        var obj = {};
        obj.authenticated = true;
        obj.id = doc.get('_id');
        obj.is_admin = doc.get('is_admin');
        obj.username = doc.get('username');

        if (doc.get('password') != password) {
          return next("Not Authenticated, Wrong Password");
        }

        // Append changes to the 'Set-Cookie' header
        res.cookie("ecse489", obj, { maxAge: 900000, httpOnly: true });

        return next();
      } else {
        return next("Not Authenticated, Unable to find user");
      }
    });
  };

  // If authenticated
  if (req.cookies.ecse489 && req.cookies.ecse489.authenticated) {
    console.log("authenticated");
    return next();
  };
};


// Checks if user is an Admin
middleware.isAdmin = function (req, res, next) {
  if (req.cookies.ecse489 && req.cookies.ecse489.is_admin) {
    next();
  } else {
    next("User must be an admin to access this endpoint");
  }
};