"use strict"
{
let { rooms,throwError, getCurrentRoom, currentRoom, currentLevel, getNextRoom, getRoomId, goToRoom, getMaxRooms, isRoomValid} = ESCAPE_ROOM;

let clueName;
let foundKey = false;

const clueClick = (event) => {
   if(!isClue(event.target.className))return;
   clueName = getClueName(event.target.className);
   changeFrame(clueName);
}


function getClueName(clueName){
    return clueName.replace('clue ', '');
}

function isClue(clueName){
    if(clueName.includes('clue'))return true;
    return false;
}

function isKey(clueName){
    if(clueName == 'key'){
        return true;
    }
    return false;
}

function changeFrame(clueName){
    if(isKey(clueName)){
        if(!foundKey){
        foundKey = true;
        document.querySelector('.key').style.display = 'none';
        }else{
            document.querySelector(`.level-${getRoomId(getCurrentRoom())}`).style.backgroundImage = `url("images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg")`;
            return;
        }
    }
    if (clueName == 'door') {
        if(foundKey){
            goToRoom(getNextRoom(getCurrentRoom()));
            foundKey = false;
            return;
        }
        return;
    }
    var img = new Image();
    img.src = `images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}.svg`;
    
    img.onerror = function(){ // Failed to load
        throwError('Couldn\'t find image at the current folder');
        
    };

    img.onload = function(){ 
        const level =  document.querySelector(`.level-${getRoomId(getCurrentRoom())}`)
        console.log(level);
        
        console.log(img.src + " " + level.style.backgroundImage.replace('url("', '').replace('")', ''));
        
        if (img.src == level.style.backgroundImage.replace('url("', '').replace('")', '') || level.style.backgroundImage == `url("images/frames/level-${getRoomId(getCurrentRoom())}/keyfound.svg")`){
            
            level.style.backgroundImage = `url("images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg")`;
            
        }else{
            if(img.src.includes('key') ||  img.src.includes('keyHide')){
                if (foundKey){
                    level.style.backgroundImage = `url("images/frames/level-${getRoomId(getCurrentRoom())}/keyfound.svg")`;
                }else{
                    console.log(`.level-${getRoomId(getCurrentRoom())} .${clueName}`);
                    
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5'
                    level.style.backgroundImage = `url("${img.src}")`;
                }
            }else{
            document.querySelector(`.${clueName}`).style.zIndex = '5'
            level.style.backgroundImage = `url("${img.src}")`;
        }
        }
    };
}



document.getElementById('rooms').addEventListener('click', clueClick);
}