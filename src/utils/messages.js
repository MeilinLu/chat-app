// const generateMessage = (text) => {
// #171 Sending Messages with correct user name
const generateMessage = (username, text) => {
    return {
        // #171
        username,
        
        text,
        createdAt: new Date().getTime()
    }
}


// const generateLocationMessage = (url) => {
// #171 Sending Messages with correct user name
const generateLocationMessage = (username, url) => {

    return {
        // #171
        username,

        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}