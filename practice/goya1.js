var express = require('express')
var favicon = require('serve-favicon')
var path = require('path')

var app = express()
app.use(favicon(path.join(__dirname,'images','lg.ico')))

app.get('/', function(req,res){
  res.send('goya');
});

app.listen(80,function(){
  console.log('app listening on port 80!');
});

