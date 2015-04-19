/**
 * Created by osamu on 4/18/15.
 */


var fs = require('fs');
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

var total = 0;
var CLICK_PRICE = 100

app.listen(3000);

function handler(req, res) {

    if (req.url == '/add') {
        console.log('募金追加');
        total += CLICK_PRICE
        io.sockets.emit('emit_from_server', total + '円');
        io.sockets.emit('emit_to_web', CLICK_PRICE + '円');

        res.writeHead(200);
        res.end();
    } else {
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
}

console.log('サーバー起動中');

io.sockets.on('connection', function(socket) {
    socket.on('emit_from_web', function(data) {
        total += Number(data.price);
        console.log(total);
        var result = {
            total: total +'円',
            text: '[10:14:35]' +data.price + '円 (某コンビニAKIBA店)'
        };
        io.sockets.emit('emit_from_server', result);
        io.sockets.emit('emit_to_web', data.price + '円');
    });

    socket.on('reset', function(data) {
        total = 0;
        console.log(total);
        io.sockets.emit('emit_from_server', total + '円');
        io.sockets.emit('emit_to_web', data);
    });
});
