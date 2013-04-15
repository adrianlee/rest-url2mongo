// Load Modules
var express = require('express');
var app = express();
var mongo =  require('./mongo');
var middleware =  require('./middleware');
var routes =  require('./routes');

// Express Configuration
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.bodyParser());

// Cookie Middleware
app.use(middleware.cookieHandler);

// General
app.get('/', middleware.basicAuth, routes.index);
app.get('/logout', routes.logout);

// User
app.get('/user', middleware.basicAuth, middleware.isAdmin, routes.user_listAll);
app.get('/user/:username', middleware.basicAuth, middleware.isAdmin, routes.user_getByUsername);
app.post('/user', routes.user_create);
app.put('/user/:username', middleware.basicAuth, middleware.isAdmin, routes.user_update);
app.delete('/user/:username', middleware.basicAuth, middleware.isAdmin, routes.user_delete);

// Dynamic
app.get('/:collection', middleware.basicAuth, middleware.hasAccessToCollection, routes.retrieve_documents);
app.get('/:collection/:id', middleware.basicAuth, middleware.hasAccessToCollection, routes.retrieve_docuemnts_by_id);
app.post('/:collection', middleware.basicAuth, middleware.hasAccessToCollection, routes.create_document);
app.put('/:collection/:id', middleware.basicAuth, middleware.hasAccessToCollection,routes.update_document);
app.delete('/:collection/:id', middleware.basicAuth, middleware.hasAccessToCollection, routes.delete_document);
app.delete('/:collection', middleware.basicAuth, middleware.hasAccessToCollection, routes.delete_documents);

// Error handler Middleware
app.use(function (err, req, res, next) {
  console.log(err);

  // 500 Internal Server Error
  res.json(500, { error: (err ? err : 'Something Broke') });
});

// Start server on port 8080
app.listen(process.argv[2] || 3000);