const rooms = document.getElementById("rooms").querySelectorAll(".room"); 
let currentRoom = 'room level-1'


function getNextRoom(roomName){
    if(roomName.replace(/[0-9]/g, '') != 'room level-'){
        console.log('Incorrect room ID, please follow same room ID formating (room level-<levelNumber>).');
        return null;
    }
    const roomID = getRoomId(roomName) + 1;

    if(roomID == null){
        console.log('Given room ID doesn\'t exist.');
        return null;
    }
    return `.room level-${roomID}`
}


function getRoomId(roomName){
    return parseInt(roomName.replace(/\D/g, ""));
}


function goToRoom(roomName){    
    if (getMaxRooms(rooms) < getRoomId(roomName)){
        console.log('Reached max limit of Rooms, please create new rooms to go further.');
        return;
    }
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


function getMaxRooms(allRooms){
    return allRooms.length;
}

const button = document.querySelector('.roomSwitcher');

const goClick = (event) => {
    goToRoom(getNextRoom(currentRoom));
    currentRoom = getNextRoom(currentRoom).replace(".", "");
       
}

button.addEventListener("click", goClick);



