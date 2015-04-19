/**
 * Created by osamu on 4/18/15.
 */


var fs = require('fs');
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

var total = 0;
var CLICK_PRICE = 100

var prices = [1, 5, 10, 50, 100, 500, 1000]

app.listen(3000);

function getResultData(price, store) {
    var d = new Date();
    var date = d.getHours() + '時' + d.getMinutes() + '分' + d.getSeconds() + '秒';
    return {
        total: total + '円',
        text: price + '円 (' + store + ' ' + date +  ')'
    };
}


function handler(req, res) {
    var randnum = Math.floor( Math.random() * 7 );
    var p = prices[randnum];
    if(req.url == '/seven') {
        total += p
        io.sockets.emit('emit_from_server', getResultData(p, 'セブンイレブンAKIBA店'));
        io.sockets.emit('emit_to_web', p + '円');

        res.writeHead(200);
        res.end();
    } else if (req.url == '/loson') {
        total += p
        io.sockets.emit('emit_from_server', getResultData(p, 'ローソン札幌店'));
        io.sockets.emit('emit_to_web', p + '円');

        res.writeHead(200);
        res.end();
    } else if (req.url == '/add') {
        console.log('募金追加');
        total += p
        io.sockets.emit('emit_from_server', getResultData(p, 'XXX店'));
        io.sockets.emit('emit_to_web', p + '円');

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
        io.sockets.emit('emit_from_server', getResultData(data.price, 'ファミマ那覇店'));
        io.sockets.emit('emit_to_web', data.price + '円');
    });

    socket.on('reset', function(data) {
        total = 0;
        console.log(total);
        io.sockets.emit('emit_from_server', total + '円');
        io.sockets.emit('emit_to_web', data);
    });
});
