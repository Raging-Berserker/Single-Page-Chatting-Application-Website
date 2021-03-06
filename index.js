const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});


users = [];
io.on('connection', function(socket) {
    console.log('A user connected');
    socket.on('setUsername', function(data) {

        if(users.indexOf(data) > -1) {
            socket.emit('userExists', 'username: ' + data + ' is taken! Try some other username.');
        } else {
            users.push(data);
            socket.emit('userSet', {username: data});
        }
        console.log(users);
    });

    socket.on('msg', function(data) {
        //Send message to everyone
        io.sockets.emit('newmsg', data);
    })

    socket.on('unSetUser', function(data) {
        //Unset the user
        const index = users.indexOf(data);
        if (index > -1) {
            users.splice(index, 1);
        }
    })
});

http.listen(3000, () => {
    console.log('listening on localhost:3000');
});
