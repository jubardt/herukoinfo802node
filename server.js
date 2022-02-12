const express = require('express');
const socketIO = require('socket.io');
var soap = require('soap');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');


const server = express().use(cors).use(express.static("public"))
  .listen(port, () => console.log(`Listening on ${port}`));

const io = socketIO(server);
var args = {};
var url = 'https://serve-python-soap.herokuapp.com/?wsdl';

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
