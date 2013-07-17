var fs = require('fs'),
    http = require('http'),
    sio = require('socket.io'),
    parseCookie = require('connect').utils.parseCookie;
    online = require('./online');


var server = http.createServer(function(req, res) {

  console.log( req.session);
  res.writeHead(200, { 'Content-type': 'text/html'});
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
io.sockets.on('connection', function (socket) {
  socket.on('message', function (msg) {
    //console.log('Received: ', msg);
    messages.push(msg);

    console.log('arguments', arguments);

    socket.broadcast.emit('message', msg);
  });


  socket.on('online', function (userId, fn) {

    console.log('userId', userId);

    //online.addUser(userId);

    online.getOnlineUser(fn);


    online.sendNewUser(userId, socket);

  });


  // send messages to new clients
  messages.forEach(function(msg) {
    socket.send(msg);
  })
});