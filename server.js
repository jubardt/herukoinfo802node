const { emit } = require('process');
var express = require('express');
var socketIO = require('socket.io');
const port = process.env.PORT || 3000
const INDEX = '/index.html';

const server = express().use(express.static("public"))
  .listen(port, () => console.log(`Listening on ${port}`));

const io = socketIO(server);

io.on('connect', function(socket){
    console.log('client connecte');

    socket.on('getList',function(){
        var args = {};
        var soap = require('soap');
        var url = 'http://127.0.0.1:8000/?wsdl';
        /*
        soap.createClient(url, function(err, client) {
            client.carList(args, function(err, result) {
                console.log(result);
                io.emit("res",result);
            });
        });*/
        
    })
})
