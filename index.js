var BinaryServer = require('binaryjs').BinaryServer,
  fs = require('fs');

var mp3 = fs.createReadStream('Jahzzar_-_03_-_Heartbreaker.mp3');

var server = new BinaryServer({
  host: '127.0.0.1',
  port: 66600
});

server.on('connection', function (client) {
  mp3.pipe(client.createStream());
});
