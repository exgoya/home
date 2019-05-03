var express = require('express')
var favicon = require('serve-favicon')
var path = require('path')

var app = express()
var router = require('./router/main')(app);

app.use(favicon(path.join(__dirname,'images','lg.ico')))
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

var server = app.listen(80,function(){
  console.log('app listening on port 80!');
});

