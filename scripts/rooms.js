"use strict" //Use strict to not pullute global variables
{
let currentRoom = 'room level-1' //Default starting level name.
let currentLevel = document.querySelector(`.level-${getRoomId(currentRoom)}`); //Section of the current level
const rooms = document.getElementById("rooms").querySelectorAll(".room"); //Div containing all rooms in the game.
//Assigning all the functions to the ESCAPE_ROOM object.
Object.assign(ESCAPE_ROOM, {
    rooms,throwError, getCurrentRoom ,currentRoom, currentLevel, getNextRoom, getRoomId, goToRoom, getMaxRooms, isRoomValid
  });


function getCurrentRoom(){
    return currentRoom;
}

/*
    getNextRoom function. Returns the level name of the next room of the given room put in parameter.
    If the given room ID formating is incorrect or the room ID exceeds the total amout of rooms it will return null.
*/
function getNextRoom(roomName){
    if(!isRoomValid(roomName))return null;
    const roomID = getRoomId(roomName) + 1;

    if(roomID == null){
        throwError('Given room ID doesn\'t exist.')
        return null;
    }
    return `.room level-${roomID}`
}


/*
    getRoomId function. Returns the current room NUMBER.
    If the given room ID formating is incorrect it will return null.
*/
function getRoomId(roomName){
    if(!isRoomValid(roomName))return null;
    return parseInt(roomName.replace(/\D/g, ""));
}


/*
    goToRoom function. This function allows you to go to the specified room. Checks if the given room name is valid, then checks
    to see if the room ID doesn't exceed the current maximun amount of rooms. Compares then all the rooms, if one of the room
    has the same ID as the given one make that room visible, the rest will be hidden.
*/
function goToRoom(roomName){    
    if(!isRoomValid(roomName))return;
    if (getMaxRooms(rooms) < getRoomId(roomName)){
        throwError('Reached max limit of Rooms, please create new rooms to go further.');
        return;
    }
    
    currentRoom = roomName.replace('.', '');
    console.log('After ' + currentRoom);
    
    for (const room of rooms) {
        if (getRoomId(room.className) == getRoomId(roomName)){
            room.classList.remove('hidden')
            room.classList.add('visible')
        }else{
            room.classList.add('hidden')
            room.classList.remove('visible')
        }
    }
    
}


/*
    getMaxRooms function. Returns the toal length of the given rooms array. 
*/
function getMaxRooms(allRooms){
    return allRooms.length;
}


/*
    isRoomValid function. Checks if the room name has a valid name: if the room name doesn't contain "room level-" it will 
    return false.
*/
function isRoomValid(roomName){    
    if(roomName.replace(/[0-9]/g, '').replace('.', '').replace(' visible', '').replace(' hidden', '') != 'room level-'){
        throwError('Incorrect room ID, please follow same room ID formating (room level-<levelNumber>).');
        return false;
    } 
    return true;
}

/*
    goToFrame function. Possible implementation to go to a specific frame of the room by changing it's background-image
    url in the CSS.
*/
function goToFrame(){    
    currentLevel.style.backgroundImage = "url('https://mdn.mozillademos.org/files/12700/basic-image.png')";
}


/*
    throwError function. Throw an error with a specific error message in console.
*/
function throwError(error){
    throw new Error(error);
}


//Possible OOP implemtation for the future.
function createNewRoom() {
    const obj = {};
    obj.name = `level-${getMaxRooms(rooms) + 1}`;
    obj.frames = new Array();
    const section = document.createElement('section');
    section.className = `room ${obj.name} hidden`
    document.querySelector('#rooms').appendChild(section);
    console.log();
    
    document.querySelector(`.${obj.name}`).style.backgroundImage = "url('')";
    return obj;
  }

//const newRoom = createNewRoom();
}