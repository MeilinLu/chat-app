// io()
const socket = io()

// #174 Deploying the Chat Application 
/* 
Goal: Deploy the chat application
1. Setup Git and commit files 
2. Setup a Github repository and push code up
3. Set up a Heroku app and push code up
4. Openthe live app and test your work
*/
// #155
/*
// same name as in.on() in index.js
socket.on('countUpdated', (count) => {
    console.log('The count has been updated!', count)
})

document.querySelector('#increment').addEventListener('click', ()=>{
    console.log('Clicked')
    socket.emit('increment')

})
*/
/*
Terminal run: npm run dev
Result (terminal):
[nodemon] starting `node src/index.js`
Server is up on port 3000!
Result (localhost:3000):
Chat App +1(button)
console: 3 Clicked (click button)
*/

// #159 Event Acknowledgements
// server (emit) -> client (receive) --acknowledgement --> server
// client (emit) -> server (receive) --acknowledgement --> client

// #160 
// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
// #161 Rendering Messages
const $messages = document.querySelector('#messages')

// Templates
// #161
const messageTemplate = document.querySelector('#message-template').innerHTML
// #162
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
// #172
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
// #167 Socket.io Rooms
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

// #173 Automatic Scrolling
const autoscroll = () => {
    // New message elemet
    const $newMessage = $messages.lastElementChild
    
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // console.log(newMessageStyles)
    // console.log(newMessageMargin)

    // visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    // figure out if scroll to the bottom before add new message in
    if (containerHeight - newMessageHeight <= scrollOffset) {
        // scroll it
        $messages.scrollTop = $messages.scrollHeight
    }
}


// #156
socket.on('message', (message) => {
    console.log(message)
    
    // #161 Rendering Messages
    const html = Mustache.render(messageTemplate, {
        // message
        // #171 
        username: message.username,
   
        // #163 message is now a object
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

    // #173 Automatic Scrolling
    autoscroll()
})

/*
// #162 Rendering Location Messages
Goal: Create a separate event for location sharing messages
1. Have server emit "locationMessage" with the URL
2. Have the client listen for "locationMessage" and print the URL
3. Test your work by sharing a location!
*/

/*
// #164 Timestamps for Location Messages
Goal: Add timestamps for location messages
1. Create generateLocationMessage and export
2. Use generatedLocationMessage when server emits locationMessage
3. Update template to render time before the url
4. Compile the template with the URL and the formated time
5. Test your work!
*/
// #164 (url) now is Object, call different 
// socket.on('locationMessage', (url) => {
socket.on('locationMessage', (message) => {
    
    // console.log(url)
    // #164 rename (url) to (message)
    console.log(message)

    const html = Mustache.render(locationMessageTemplate, {

        // #171 Sending Messages to Rooms
        username: message.username,

        // url
        // #164 rename (url) to (message)
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

    // #173 Automatic Scrolling
    autoscroll()
})

/*
// #162 Rendering Location Messages
Goal: Create a separate event for location sharing messages
1. Duplicate the message template
    - Change the id to something else
2. Add a link inside the paragraph with the link text "My current location"
    - URL for link should be the maps URL (dynamic)
3. Select the template from JavaScript
4. Render the template with the URL and append to messages list
5. Test your work!
*/

// document.querySelector('#message-form').addEventListener('submit', (e) => {
// #160 update with element variables

// #172 Rendering User List


socket.on('roomData', ({ room, users }) => {
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e) => {

    e.preventDefault()

    // #160 disable
    // disables the form once it's been submitted
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    
    // #159
    // socket.emit('sendMessage', message)
    /*
    socket.emit('sendMessage', message, (message) => {
        console.log('The message was delivered!', message)
    })
    */
    // Validate profanity
    socket.emit('sendMessage', message, (error) => {
        // #160 enable
        // #160 reenable the button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        // #160 focus to move the cursor inside
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
    // console.log('The message was delivered!', message)
    console.log('Message delivered!')
})
})

// #158 Sharing Your Location
// document.querySelector('#send-location').addEventListener('click', () => { */

$sendLocationButton.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    // #160 Disable the button 
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {

            // #160 enable the button
            $sendLocationButton.removeAttribute('disabled')

            console.log('Location shared!')
        })
    })
})

// #167 Socket.io Rooms
// socket.emit('join', { username, room})
// #170 Tracking Users Joining and Leaving: (error) function
socket.emit('join', { username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})




/*
Terminal run: npm run dev
Result (localhost:3000):
Chat App +1(button)
console: 
Welcome!
*/

/*
Goal: send a welcome message to new users 
1. Have server emit “message” when new client connects
	- Send “Welcome” as the event data
2. Have client listern for “message” event and print to console
3. Test your work!
*/

/*

// #158 Sharing Your Location
Goal: Share coordinates with other users 
1. Have client emit “sendLocation” with an object as the data
	- Obect should contain latitude and longitude properties
2. Server should listen for “sendLocation”
	- When fired, send a “message” to all connected clients “Location: long, lat”
3. Test your work!
*/

/*
// #159 Event Acknowledgments
Goal: Setup acknowledgement
1. Setup the client acknowledgement function
2. Setup the server to send back the acknowledgement 
3. Have the client print "Location shared!"
4. Test your work!
*/

/* 
// #160 Form and Button States
Goal: Disable the send location button while location being sent
1. Set up a selector at the top of the file
2. Disable the button just before getting the current position
3. Enable the button in the ackonwledgement callback
4. Test your work
*/