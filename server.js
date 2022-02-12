const express = require('express');
const socketIO = require('socket.io');
var soap = require('soap');
const port = process.env.PORT || 3000;
const app = express();


const server = express().use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://info802-rest.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}).use(express.static("public"))
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
