"use strict"
{
let { rooms,throwError, getCurrentRoom, currentRoom, currentLevel, getNextRoom, getRoomId, goToRoom, getMaxRooms, isRoomValid} = ESCAPE_ROOM;

let clueName;
let foundKey = false;
let lastInteraction = '';
let foundHideSpot = false;

const clueClick = (event) => {
   if(!isClue(event.target.className))return;
   clueName = getClueName(event.target.className);
   changeFrame(clueName);
   lastInteraction = clueName;
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

function playSound(sound){    
    const audio = new Audio(`../sounds/${sound}`);
    audio.onerror = function(){ // Failed to load
        throwError(`Failed to play find sound at: ${audio.src}`);
        return false;
    };
    audio.play();
}

function setFrame(){

}

function changeFrame(clueName){
    const level =  document.querySelector(`.level-${getRoomId(getCurrentRoom())}`)    
    const img = new Image();

    if (clueName == 'door') {
        if(foundKey){
            goToRoom(getNextRoom(getCurrentRoom()));
            foundKey = false;
            lastInteraction = '';
            playSound('key-open.mp3');
            return;
        }
        return;
    }

    if (lastInteraction == clueName) {
        if (foundKey && clueName) {            
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
        }else{
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg`;
        }
        img.onload = function(){             
            level.style.backgroundImage = `url("${img.src}")`;
            lastInteraction = '';
        }
        return;
    }
    console.log(clueName);
    
    if (foundKey && getCurrentRoom() != 'room level-1'){
        img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}-nokey.svg`;
    }else{
        img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}.svg`;
    }
    if (isKey(clueName)) {
        if(!foundKey && lastInteraction == 'keyHide'){
            foundKey = true;
            document.querySelector('.key').style.display = 'none';
            playSound('pick-key.mp3');
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
            img.onload = function(){ 
            level.style.backgroundImage = `url("${img.src}")`;
            return;
            }
        }else{
            document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
        }
    }else{
        img.onload = function(){ 
            console.log(clueName);
            
            if (foundHideSpot) {
                foundHideSpot = false;
                document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
            }
            if (clueName == 'keyHide') {                
                foundHideSpot = true;
                document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5';
            }
            level.style.backgroundImage = `url("${img.src}")`;
        }
    }
















    /*
    
    img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}.svg`;
    img.onerror = function(){ // Failed to load
        throwError(`Failed to find image at: ${img.src}`);
        return false;
    };
    console.log(clueName);
    console.log('Found key: ' + foundKey);
    
    if (isKey(clueName)) {
        if(!foundKey){
            foundKey = true;
            document.querySelector('.key').style.display = 'none';
            playSound('pick-key.mp3');
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg`;
            img.onload = function(){ 
            level.style.backgroundImage = `url("${img.src}")`;
            return;
            }
        }
    }else{
        img.onload = function(){ 
            const level =  document.querySelector(`.level-${getRoomId(getCurrentRoom())}`)                
            if (img.src == level.style.backgroundImage.replace('url("', '').replace('")', '') || level.style.backgroundImage == `url("images/frames/level-${getRoomId(getCurrentRoom())}/keyfound.svg")`){
                if(foundKey){
                    level.style.backgroundImage = `url("../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg")`;
                }else{
                    level.style.backgroundImage = `url("../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg")`;
                }

            }else{
                if(img.src.includes('keyHide')){
                    if (foundKey){
                        level.style.backgroundImage = `url("../images/frames/level-${getRoomId(getCurrentRoom())}/keyfound.svg")`;
                    }else{                    
                        document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5'
                        level.style.backgroundImage = `url("${img.src}")`;
                    }
                }else{
                    if (foundKey && getCurrentRoom != 'room level-1') {
                        console.log(`url("${img.src}-nokey")`);
                        
                        playSound('picking-object.mp3');
                        level.style.backgroundImage = `url("${`../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}-nokey.svg`}")`;
                    }else{
                        console.log('in');
                        
                        playSound('picking-object.mp3');
                        level.style.backgroundImage = `url("${img.src}")`;
                    }
            }
            }
        };
    }
    */
}


function changeFrame2(clueName){
    const img = new Image();
    if(isKey(clueName)){
        if(!foundKey){
        foundKey = true;
        document.querySelector('.key').style.display = 'none';
        playSound('pick-key.mp3');
        }else{
            document.querySelector(`.level-${getRoomId(getCurrentRoom())}`).style.backgroundImage = `url("images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg")`;
            return;
        }
    }
    if (clueName == 'door') {
        if(foundKey){
            goToRoom(getNextRoom(getCurrentRoom()));
            foundKey = false;
            playSound('key-open.mp3');
            return;
        }
        return;
    }
    
    img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}.svg`;
    
    img.onerror = function(){ // Failed to load
        throwError('Couldn\'t find image at the current folder');
        
    };

    img.onload = function(){ 
        const level =  document.querySelector(`.level-${getRoomId(getCurrentRoom())}`)                
        if (img.src == level.style.backgroundImage.replace('url("', '').replace('")', '') || level.style.backgroundImage == `url("images/frames/level-${getRoomId(getCurrentRoom())}/keyfound.svg")`){
            level.style.backgroundImage = `url("../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg")`;
        }else{
            if(img.src.includes('key') ||  img.src.includes('keyHide')){
                if (foundKey){
                    level.style.backgroundImage = `url("../images/frames/level-${getRoomId(getCurrentRoom())}/keyfound.svg")`;
                }else{                    
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5'
                    level.style.backgroundImage = `url("${img.src}")`;
                }
            }else{
    
                playSound('picking-object.mp3');
            level.style.backgroundImage = `url("${img.src}")`;
        }
        }
    };
}



document.getElementById('rooms').addEventListener('click', clueClick);
}









