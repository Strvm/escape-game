"use strict" 
{
    let {
        rooms,
        throwError,
        getCurrentRoom,
        currentRoom,
        currentLevel,
        getNextRoom,
        getRoomId,
        goToRoom,
        getMaxRooms,
        isRoomValid
    } = ESCAPE_ROOM;
    Object.assign(ESCAPE_ROOM, {
        setFoundKey,
        typeWriter,
        playSound
    });
    let clueName;
    let foundKey = false;
    let lastInteraction = '';
    let foundHideSpot = false;
    let isLocked = true;
    let tireBouchonFound = false;
    let isOpen = false;


    /*
        Main event. With this click event we listen to see if the element clicked contains the class "clue".
        If it does we try to change to the correct frame.
    */
    const clueClick = (event) => {
        if (!isClue(event.target.className)) return;
        clueName = getClueName(event.target.className);
        changeFrame(clueName);
        lastInteraction = clueName;
    }

    /*
        setFoundKey function. This function is mostly use in other Javascript files to set if the user has found/won the key.
    */
    function setFoundKey(bool) {
        foundKey = bool;
    }

    /*
        getClueName function. Used to replace "clue" from class name and only get the specific clue name.
    */
    function getClueName(clueName) {
        return clueName.replace('clue ', '');
    }

    /*
        isClue function. Checks if an element is a clue by checking if it has the "clue" class.
    */
    function isClue(clueName) {
        if (clueName.includes('clue')) return true;
        return false;
    }

    /*
        isKey function. Checks if an element is a clue by checking if it has the "key" class.
    */
    function isKey(clueName) {
        if (clueName == 'key') {
            return true;
        }
        return false;
    }

    /*
        playSound function. Is used to play a specific sounds stored in ./sounds. 
    */
    function playSound(sound) {
        const audio = new Audio(`../sounds/${sound}`);
        audio.onerror = function() { // Failed to load
            throwError(`Failed to play find sound at: ${audio.src}`);
            return false;
        };
        audio.volume = 0.5;
        audio.play();
    }

    /*
        clearText function. Is used to make current type writing text visible on screen dissapear. 
    */
    function clearText(){
        try {
            const lastDialogue = document.querySelector(lastText);
            lastDialogue.classList.add('hidden');
            lastDialogue.textContent = savedText;
            clearTimeout(timeOut);

        } catch (error) {}   
    }

    /*
        changeFrame function. Main method of file. Is used to change the frame of the room. Also deals with a bunch
        of specific stuff for each room.
    */
    function changeFrame(clueName) {
        const level = document.querySelector(`.level-${getRoomId(getCurrentRoom())}`)
        const img = new Image();

        if (clueName == 'door') {
            if (foundKey) {
                if(isOpen){
                    foundKey = false;
                    isLocked = true;
                    isOpen = false;
                    lastInteraction = '';
                    goToRoom(getNextRoom(getCurrentRoom()))
                    document.querySelector('.key-stuff').style.display = "none";
                    document.querySelector('.key-success').style.display = "none";
                    document.querySelector('.tirebouchon-stuff').style.display = "none";
                    document.querySelector(".tirebouchon-success").style.display = "none";
                }else{
                    playSound('key-open.mp3');
                    setTimeout(function() {
                        isOpen = true;
                        img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-opendoor.svg`;
                        img.onload = function() {
                        level.style.backgroundImage = `url("${img.src}")`;
                        clearText();                          
                        typeWriter(`.dialogues-zone .doorOpen${getRoomId(getCurrentRoom())+1}`, false, 50);
                        playSound('door-open.mp3');
                }
                    }, 750)
                }
                
                return;
            }
            return;
        }

        if (lastInteraction == clueName && lastInteraction != 'coffreOuvert') {
            if (foundKey && clueName && getCurrentRoom() == 'room level-2') {
                img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
            } else {
                img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg`;
            }
            img.onload = function() {
                level.style.backgroundImage = `url("${img.src}")`;
                lastInteraction = '';
            }
            return;
        }
        if (foundKey && getCurrentRoom() == 'room level-2') {
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}-nokey.svg`;
        } else {
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}.svg`;
        }
        if (isKey(clueName)) {

            if (!foundKey && lastInteraction == 'keyHide') {
                foundKey = true;
                document.querySelector('.key').style.display = 'none';
                playSound('pick-key.mp3');
                document.querySelector('.key-stuff').style.display = "block";
                document.querySelector('.key-success').style.display = "block";
                img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
                img.onload = function() {
                    level.style.backgroundImage = `url("${img.src}")`;
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
                    typeWriter(`.dialogues-zone .keyFound`, false, 50);
                    return;
                }
            } else {
                document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
            }
        } else {
            img.onload = function() {
                switch (getCurrentRoom()) {
                    case 'room level-1':
                        if (getCurrentRoom() == 'room level-1') {
                            if (foundHideSpot) {
                                foundHideSpot = false;
                                document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
                            }
                            if (clueName == 'keyHide') {
                                foundHideSpot = true;
                                document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5';
                            }

                        }
                        break;
                    case 'room level-2':
                        if (clueName == 'tiroirTireBouchon' && !tireBouchonFound) {
                            tireBouchonFound = true;
                            document.querySelector('.tireBouchon').style.display = 'block';
                        }
                        if (clueName == 'tireBouchon' && isLocked) {
                            isLocked = false;
                            document.querySelector('.tireBouchon').style.display = 'none';
                            document.querySelector(".tirebouchon-stuff").style.display = "block"
                            document.querySelector(".tirebouchon-success").style.display = "block"
                        }
                        break;
                    case 'room level-3':
                        if (clueName == 'coffreOuvert') {
                            document.querySelector(`.safeVaultContainer`).style.display = 'block';
                        }
                        break;
                    case 'room level-4':
                        if (clueName == 'placard') {
                            document.querySelector(`.labyrinthContainer`).style.display = 'block';
                        }
                        break;
                }
                if (getCurrentRoom() != 'room level-1') {
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

                }
                clearText();             
                typeWriter(`.dialogues-zone .${clueName}`, false, 50)
                level.style.backgroundImage = `url("${img.src}")`;
            }



            if (clueName == 'keyHide' && foundKey && getCurrentRoom() == 'room level-1') {
                img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
                img.onload = function() {
                    level.style.backgroundImage = `url("${img.src}")`;
                }
            }

            if (clueName == 'tiroirTireBouchon' && tireBouchonFound && getCurrentRoom() == 'room level-2') {
                img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/tiroirTireBouchon-notir.svg`;
                img.onload = function() {
                    level.style.backgroundImage = `url("${img.src}")`;
                }
            }
        }

    }




    document.getElementById('rooms').addEventListener('click', clueClick);


    let i = 0; //Our counter for the loop.
    let text; //Store the element.
    let textChars; //Stores the characters before they get removed.
    let timeOut; //Stores the setTimeOut so we can cancel it when we want.
    let timeOut2;
    let lastText = '' //Stores the last element printed.
    let savedText = ''; //Stores the last text contents printed.
    function typeWriter(textid, wipe, speed) {
        textid = textid.split('text')[0] //Format the ID of the element we want to print.
        text = document.querySelector(textid);
        if (text == null) {
            console.log('Given paragraph ID is null.');
            return;
        }
        if (!wipe) { //This condition is only ran the first time you execute the function.
            i = 0;
            clearTimeout(timeOut2)
            savedText = text.textContent;
            lastText = textid;
            textChars = text.textContent;
            text.textContent = "";
            text.style.display = 'block' //Display the text container we want to print.
            wipe = true;
        }
        text.classList.remove('hidden'); //Make the text visible
        if (i < textChars.length) {
            text.textContent += textChars.charAt(i); //Adding new character to the content of the span     
            i++;
            timeOut2 = setTimeout(function() {
                typeWriter('.dialogues-zone .' + text.className, wipe, speed);
            }, speed);
        } else {
            timeOut = setTimeout(function() {
                if (!text.className.includes('hidden')) text.classList.add('hidden');
            }, 4000); //Dissappear after 4s
            i = 0;
        }
    }




}