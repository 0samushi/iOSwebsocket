var fs = require('fs');
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

app.listen(3000);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('エラー')
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    });
};

console.log('サーバー起動中...');

io.sockets.on('connection', function(socket) {
    socket.on('emit_from_client', function(data) {
        console.log(data);
        io.sockets.emit('emit_from_server', '[' + data.name + ']' + data.msg);
    });
});