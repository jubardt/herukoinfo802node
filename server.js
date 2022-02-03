const express = require('express');
const socketIO = require('socket.io');
var soap = require('soap');
const port = process.env.PORT || 3000

const server = express().use(express.static("public"))
  .listen(port, () => console.log(`Listening on ${port}`));

const io = socketIO(server);
var args = {};
var url = 'http://127.0.0.1:8000/?wsdl';

io.on('connection', (socket)=>{
    console.log('client connecte');

    socket.on('getList',function(){
        soap.createClient(url, function(err, client) {
            client.carList(args, function(err, result) {
                console.log(result);
                io.emit("res",result);
            });
        });
        
    })
})
