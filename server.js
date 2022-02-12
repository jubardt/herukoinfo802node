const express = require('express');
const socketIO = require('socket.io');
var soap = require('soap');
const port = process.env.PORT || 3000;
const request = require('request');

const server = express().use(express.static("public"))
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

    socket.on('calcReq',function(){
        request('https://info802-rest.herokuapp.com/tempsTrajet?autonomie=50&chargement=50&distance=100&vitesse=50', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(res.body);
          });
    })
})
