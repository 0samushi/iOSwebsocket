/**
 * Created by osamu on 4/18/15.
 */


var fs = require('fs');
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

var total = 0;

app.listen(3000);

function handler(req, res) {
    fs.readFile(__dirname + '/bokin.html', function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('エラー');
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    });
}

console.log('サーバー起動中');

io.sockets.on('connection', function(socket) {
    socket.on('emit_from_web', function(data) {
        total += Number(data.price);
        console.log(total);
        io.sockets.emit('emit_from_server', total + '円');
    });
});
