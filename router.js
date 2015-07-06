var routes = require('i40')(),
    fs = require('fs'),
    db = require('monk')('localhost/movies'),
    movies = db.get('movies'),
    qs = require('qs'),
    view = require('./view'),
    mime = require('mime')

routes.addRoute('/', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    var template = view.render('/movies/home', {})
    res.end(template)
  }
})

routes.addRoute('/movies', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    movies.find({}, function(err, docs) {
      if (err) res.end('404')
      var template = view.render('/movies/index', {movies: docs})
      res.end(template)
    })
  }
  if (req.method === 'POST') {
    var data = ''
    req.on('data', function(chunk) {
      data += chunk
    })
    req.on('end', function() {
      console.log('hi')
      var movie = qs.parse(data)
      var insertMovie = movies.insert(movie)
      insertMovie.on('success', function() {
        res.writeHead(302, {'Location': '/movies'})
        res.end()
      })
    })
  }
})

routes.addRoute('/movies/new', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  var template = view.render('/movies/new', {})
  res.end(template)
})

routes.addRoute('/movies/:id', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    movies.findOne({_id: url.params.id}, function(err, docs) {
      if (err) res.end('404')
      var template = view.render('/movies/show', {movies: docs})
      res.end(template)
    })
  }
})

routes.addRoute('/movies/:id/edit', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    movies.findOne({_id: url.params.id}, function(err, docs) {
      if (err) res.end('404')
      var template = view.render('/movies/edit', {movies: docs})
      res.end(template)
    })
  }
})

routes.addRoute('/movies/:id/update', (req, res, url) => {
  if (req.method === 'POST') {
    var data = ''
    req.on('data', function(chunk) {
      data += chunk
    })
    req.on('end', function() {
      var movie = qs.parse(data)
      var updateMovie = movies.update({_id: url.params.id}, movie)
      updateMovie.on('success', function(err, docs) {
        res.writeHead(302, {'Location': '/movies'})
        res.end()
      })
    })
  }
})

routes.addRoute('/movies/:id/delete', (req, res, url) => {
  if (req.method === 'POST') {
    movies.remove({_id: url.params.id}, function(err) {
      if (err) res.end('404')
      res.writeHead(302, {'Location': '/movies'})
      res.end()
    })
  }
})

routes.addRoute('/public/*', (req, res, url) => {
  res.setHeader('Content-Type', mime.lookup(req.url))
  fs.readFile('.' + req.url, function(err, file) {
    if (err) {
      res.setHeader('Content-Type', 'text/html')
      res.end('404')
    }
    res.end(file)
  })
})


module.exports = routes
