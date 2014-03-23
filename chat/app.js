
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

//app.listen(process.env.PORT, process.env.IP,Function(){
app.listen(process.env.PORT,process.env.IP, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
    //クライアント側からのイベントを受け取る。
    socket.on('msg send', function (msg) {
        //イベントを実行した方に実行する
        socket.emit('msg push', msg);
        //イベントを実行した方以外に実行する
        socket.broadcast.emit('msg push', msg);
    });
    //接続が解除された時に実行する
    socket.on('disconnect', function() {
    log('disconnected');
    });
});
