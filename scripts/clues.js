"use strict"
{
let { rooms,throwError, getCurrentRoom, currentRoom, currentLevel, getNextRoom, getRoomId, goToRoom, getMaxRooms, isRoomValid} = ESCAPE_ROOM;

let clueName;
let foundKey = false;
let lastInteraction = '';
let foundHideSpot = false;
let isLocked = true;

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
            isLocked = true;
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
            document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
            return;
            }
        }else{
            document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
        }
    }else{
        img.onload = function(){ 
            console.log(clueName);
            if (getCurrentRoom() == 'room level-1') {    
                if (foundHideSpot) {
                    foundHideSpot = false;
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
                }
                if (clueName == 'keyHide') { 
                    foundHideSpot = true;
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5';
                }

            }else{
                if (foundHideSpot) {
                    foundHideSpot = false;
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
                }

                if (clueName == 'keyHide' && isLocked) {  
                    return;
                }

                if (clueName == 'keyHide' && !isLocked) {  
                    foundHideSpot = true;
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .key`).style.display = 'block';
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5';
                }
                if (clueName == 'tireBouchon' && isLocked && getCurrentRoom() != 'room level-1') {
                    isLocked = false;
                }
            }

            level.style.backgroundImage = `url("${img.src}")`;
        }
        if(clueName == 'keyHide' && foundKey && getCurrentRoom() == 'room level-1'){
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
            img.onload = function(){ 
                level.style.backgroundImage = `url("${img.src}")`;
            }
        }
    }


    function iscolliding(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    function isinside(a, b) {
        if (a.top <= b.top && a.left <= b.left && a.right >= b.right && a.bottom >= b.bottom)return true;
        return (false); 
    }

    document.addEventListener('keydown', (event) => {
        const player = document.getElementById("player");
        if (event.key == "ArrowUp") {
            player.style.top = (parseFloat(player.style.top) - 0.5) + "%";
        }
        else if (event.key == "ArrowDown") {
            player.style.top = (parseFloat(player.style.top) + 0.5) + "%";
        }
        else if (event.key == "ArrowLeft") {
            player.style.left = (parseFloat(player.style.left) - 0.5) + "%";
        }
        else if (event.key == "ArrowRight") {
            player.style.left = (parseFloat(player.style.left) + 0.5) + "%";
        }
        const labyrinthe = document.querySelector("#labyrinthe");
        console.log();
        setTimeout(function(){ 
        if (!isinside(labyrinthe.getBoundingClientRect(), player.getBoundingClientRect())) {
            player.style.top = "90%";
            player.style.left = "5%";
            return;
        }
        }, 10);
        
        const walls = document.getElementsByClassName("wall");
        for (let i = 0; i < walls.length; i++) {
            if (iscolliding(walls[i].getBoundingClientRect(), player.getBoundingClientRect())) {
                player.style.top = "90%";
                player.style.left = "5%";
                return;
            }
        }
        const finish = document.querySelector("#finish");
        if (iscolliding(finish.getBoundingClientRect(), player.getBoundingClientRect())) {
            // TODO WIN
            labyrinthe.style.visibility = "hidden";
            console.log("WIN");
            
            return;
        }
    });













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









