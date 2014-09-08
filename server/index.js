var express  = require('express');
var socketio = require('socket.io');

var app = express();

app.use(express.static( __dirname + '/client'));

app.get( '/', function( req, res ){
    res.sendFile( __dirname + '/client/index.html' );
});

var server = app.listen(3000, function() {
    console.log('And we are live on port %d', server.address().port);
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    console.log('A socket connected!');
});