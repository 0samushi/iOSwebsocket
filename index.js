var fs = require('fs');
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

app.listen(3000);

function handler(req, res) {
    console.log('リクエスト！');
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

//--------------------------------------
// Socket接続時のロジック
//--------------------------------------
io.sockets.on('connection', function(socket) {

    // ブラウザからデータ受信
    socket.on('emit_from_client', function(data) {
        console.log(data);
        io.sockets.emit('emit_from_server', '[' + data.name + ']' + data.msg);
    });

    // iOSからデータ受信
    socket.on('emit_from_ios', function(data) {
        console.log(data);
        socket.broadcast.to(data.roomId).emit('emit_from_server', data);
    });

    // iOSから部屋入室要求
    socket.on('join_from_ios', function (data) {
        console.log(data);
        socket.join(data.room);
    });

    // Nainから友だちリスト部屋入室要求
    socket.on('join_in_friends_room', function(data) {
        console.log(data);
        var i = 0;
        for(i=0; i<data.users.length; i++) {
            var id = data.users[i];
            socket.join(id);
        }
    });

    // Nainからステータスエミット
    socket.on('emit_status', function(data) {
        console.log(data);
    });

});
