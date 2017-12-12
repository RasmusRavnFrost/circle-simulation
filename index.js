let express = require("express");
let path = require('path');
let app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

let http = require('http');

let server = http.createServer(app);

server.listen(3000);