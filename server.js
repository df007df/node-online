var fs = require('fs'),
    http = require('http'),
    sio = require('socket.io'),
    parseCookie = require('connect').utils.parseCookie;
    online = require('./online');



var server = http.createServer(function(req, res) {

    console.log( req.session);
    res.writeHead(200, {
        'Content-type': 'text/html'
    });
    res.end(fs.readFileSync('./index.html'));
});
server.listen(8000, function() {
    console.log('Server listening at http://localhost:8000/');
});
// Attach the socket.io server
io = sio.listen(server);





// store messages
var messages = ['wellcome !'];
// Define a message handler
io.of('/online').on('connection', function (socket) {

    socket.on('online', function (userId, fn) {

        online.getOnlineUser(fn);
        online.sendNewUser(userId, socket);

    });

    socket.on('offline', function (userId, fn) {
        //通知删除,并且删除memcached


    });


    socket.on('disconnect', function() {

        //io.sockets.sockets[sid].json.send({ a: 'b' });
        //var data = online.offlineUser(socket.id);
        //socket.broadcast.emit('offline',  data);

        //console.log("#############Connection " + socket.id + " : " + data.userId + " terminated.");
    });




    // send messages to new clients
    messages.forEach(function(msg) {
        socket.send(msg);
    })
});


io.of('/message').on('connection', function (socket) {

    socket.on('message', function (msg) {
        //console.log('Received: ', msg);
        messages.push(msg);

        console.log('arguments', arguments);

        socket.broadcast.emit('message', msg);
    });

});

