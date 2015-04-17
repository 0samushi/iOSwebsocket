/**
 * Created by osamu on 4/17/15.
 */

var http = require('http');
var server = http.createServer();
server.on('request', function (req, res) {
    res.writeHead(200, {'Cotent-Type': 'plain/text'});
    res.write('はろろ');
    res.end();
});
server.listen(3000);

console.log('サーバー起動中...');