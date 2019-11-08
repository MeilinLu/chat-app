const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

// configure the server (use express static middleware)
app.use(express.static(publicDirectoryPath))

// #155
// let count = 0
/*
io.on('connect', () => {
    console.log('New WebSocket connection ')
})
*/
// #155
io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    // #155
    /*
    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        // socket.emit('countUpdated', count)
        io.emit('countUpdated', count)
    })
    */

    // #156
    // socket.emit('message', "Welcome!")
    // #163 Working with Time
    // provide object instead of string "Welcome!"
    /*
    socket.emit('message', {
        text: 'Welcome!',
        createdAt: new Date().getTime()
    })
    */

    


    // #167 Socket.io Rooms
    //socket.on('join', ({username, room}) => {
    // #170 Tracking Users Joining and Leaving
    socket.on('join', ({username, room}, callback) => {
        const { error, user} = addUser({ id: socket.id, username, room}) 
        if (error) {
            return callback(error)
        }
        
        // #170 user.room
        // socket.join(room)
        socket.join(user.room)

        // #167 move socket.emit and sockect.broadcast.emit after socket.join
        //      because only show them when user join a room

        // #163 generate a function to reuse code (messages.js/utils/src)
        // socket.emit('message', generateMessage('Welcome!'))   
        // #171 send message with username
        socket.emit('message', generateMessage('Admin', 'Welcome!'))   


        // #157
        // socket.broadcast.emit('message', 'A new user has joined!')
        // #163 
        // socket.broadcast.emit('message', generateMessage('A new user has joined!'))
        // #167 limit the broadcast message only in the room
        // socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
        // #170 user.room, user.username
        // socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))
        // #171 send message with username
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`))

        // #172 Rendering User List
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        

        // #170 Tracking Users Joining and Leaving
        callback()
    })

    // #156
    /*
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
    */

    /*
    // #171 Sending Messages to Rooms
    Goal: Send messages to correct room
    1. User getUser inside "sendMessage" event handler to get user
    2. Emit the message to their current room
    3. Test your work!
    4. Repeat for "sendLocation"
    ==> 
    Edit function 
    socket.on('sendMessage'...) and 
    socket.on('sendLocation'...)
    to get the message send to the correct room
    */

    // #159
    socket.on('sendMessage', (message, callback) => {

        // #171 Sending Messages to Rooms
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }
        // io.emit('message', message)
        // #163 
        // io.emit('message', generateMessage(message))
        // #167 Socket.io Rooms
        // io.emit('message', generateMessage(message))
        // #171 Sending Messages to Rooms
        // io.to(user.room).emit('message', generateMessage(message))
        // #171 Sending Messages with username
        io.to(user.room).emit('message', generateMessage(user.username, message))

        callback()
    })
    /*
    // #171
    Goal: Render username for text messages
    1. Set up the server to send username to client
    2. Edit every call to "generateMessage" to include username
        - User "Admin" for sts messages like connect/welcome/disconnect
    3. Update client to render username in template
    4. Test your work!
    */
    // #158 Sharing Your Location
    socket.on('sendLocation', (coords, callback) => {

        // #171 Sending Messages to Rooms
        const user = getUser(socket.id)

        // io.emit('message', `Location: ${coords.latitude},${coords.longitude}`)
        //io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        
        // #162
        // io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        // #164 Timestamps for Location Messages
        // io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        // #171 Sending Messages to Rooms
        // io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        // #171 Sending Messages with username
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))


        callback()
    })

    // #157
    socket.on('disconnect', () => {

        // #170 Tracking Users Joining and Leaving
        const user = removeUser(socket.id)

        // io.emit('message', 'A user has left!')
        // #163 
        // io.emit('message', generateMessage('A user has left!'))
        // #170 only user in the same room see the message 
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        
            // #172 Rendering User List
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            
        }   
    })

    
})
// start the server up
/*
app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
*/
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
/*
//  #152. Creating the Chat App Project
Challenge 1
Goal: Create an Express web server 
1. Initialize npm and install Express
2. Setup a new Express server 
    - Server up the public directory
    - Listen on port 3000
3. Create index.html and render “Chat App” to the screen
4. Test you work! Start the server and view the page in the browser

Terminal run: node src/index.js
Result (terminal):
Server is up on port 3000!
Result (localhost:3000):
Chat App
*/

/* 
//  #152. Creating the Chat App Project
Challenge 2
Goal: Setup scripts in package.json
1. Create a “start” script to start the app using node
2. Install nodemon and a development dependency
3. Create a “dev” script to start the app using nodemon
4. Run both scripts to test your work!

In package.json file:
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },

Terminal run: npm run start
Result (terminal):
Server is up on port 3000!
Result (localhost:3000):
Chat App

Terminal run: npm run dev
Result (terminal):
[nodemon] starting `node src/index.js`
Server is up on port 3000!
Result (localhost:3000):
Chat App
*/
