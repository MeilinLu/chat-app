const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    
    // Check for existing user: same room and same username 
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
} 

// RemoveUser
const removeUser = (id) => {
    /*
    const index = user.findIndex((user) => {
        return user.id === id
    })
    */
   const index = users.findIndex((user) => user.id === id)
   if (index !== -1) {
       return users.splice(index, 1)[0]
   }
}

// #169 get user
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

// #169 get users in the room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

/*
addUser({
    id: 22,
    username: 'Ami',
    room: 'Philly'
})

addUser({
    id: 32,
    username: 'Betty',
    room: 'Philly'
})

addUser({
    id: 42,
    username: 'Chloe',
    room: 'Jersey'
})
*/

// display all users (array)
// console.log(users)

// Check error messages
/*
const res = addUser({
    id: 33,
    username: 'Ami',
    room: 'Philly'
})
console.log(res)
*/

// test removeUser
/*
const removedUser = removeUser(22)

console.log(removeUser)
console.log(users)
*/

// test getUser
/*
const user = getUser(42)
console.log(user)
*/

// test getUsersInRoom
/*
const userList1 = getUsersInRoom('philly')
console.log(userList1)
const userList2 = getUsersInRoom('Jersey')
console.log(userList2)
const userList3 = getUsersInRoom('NYC')
console.log(userList3)
*/

/*
// #168-169 Storing Users
Goal: Create two new function for users
1. Create getUser
    - Accept id and return user object (or undefined)
2. Create getUsersInRoom
    - Accept room name and return array of users (or empty array)
3. Test your work by calling the functions!

*/

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



