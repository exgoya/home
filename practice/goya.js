var http = require('http')
var fs = require('fs')
var favicon = require('serve-favicon')
var finalhandler = require('finalhandler')
var path =require('path')

var _favicon = favicon(path.join(__dirname, 'images', 'lg.ico'))

var server = http.createServer(function (req, res) {
   
var done = finalhandler(req, res)
 
  _favicon(req, res, function onNext (err) {
    if (err) return done(err) 

     
     res.statusCode = 404
     res.end('oops')
  })
                
  fs.readFile('goya.html',function(err,data){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
})
server.listen(80);
