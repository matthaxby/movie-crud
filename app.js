var http = require('http'),
    router = require('./router'),
    url = require('url')

var server = http.createServer(function(req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }
  var path = url.parse(req.url).pathname
  var currentRoute = router.match(path)
  currentRoute.fn(req, res, currentRoute)
})
//remember to refactor currentRoute

server.listen(8000, function (err) {
  if (err) console.log('fix your fucking code')
  console.log('Good to go on 8000')
})
