"use stric"
{

let beingMoved = false;
document.querySelector('.homeButton').addEventListener("click", function(e) {
    event.preventDefault();
    typeWriter('.dialogues-zone .homeText', false, 50);
    const img = new Image();
    img.src = `./images/frames/home/homeOpen.svg`;
    document.querySelector('.door').style.display = 'block'
    img.onload = function(){ 
        document.querySelector('.home').style.backgroundImage = 'url("./images/frames/home/homeOpen.svg")'
        const audio = new Audio(`./sounds/door-open.mp3`);
        audio.volume = 0.05
        audio.play();
    }
    
});

document.querySelector('.door').addEventListener("click", function(e) {
    if (document.querySelector('.door').style.display != 'none'){
        window.location.href = "./pages/game.html";
    }
});


const ghost = document.querySelector(".ghost");
    document.addEventListener("mousemove", getMouse); 


    ghost.style.position = "absolute"; //css		
    let ghostPos = {x:0, y:0};

    setInterval(followMouse, 50);
    
    let mouse = {x:0, y:0}; //mouse.x, mouse.y
    
    function getMouse(e){
        
        mouse.x = e.pageX;
        mouse.y = e.pageY;

    }
    
    function followMouse(){
        //1. find distance X , distance Y
        const distX = mouse.x - ghostPos.x;
        const distY = mouse.y - ghostPos.y;
        //Easing motion
   //Progressive reduction of distance 
        ghostPos.x += distX/80;
        ghostPos.y += distY/32;
        
        ghost.style.left = ghostPos.x + "px";
        ghost.style.top = ghostPos.y + "px";
     
    }



    let i = 0;
let text;
let textChars;
let timeOut;
let lastText = ''
function typeWriter(textid, wipe, speed) { 
    console.log('in');
       
    textid = textid.split('text')[0] 
    text = document.querySelector(textid);
    
    if (text == null){
        console.log('Given paragraph ID is null.');
        return;
    }
    if (!wipe){
        lastText = textid;
        textChars = text.textContent;
        text.textContent = "";
        wipe = true;
        text.style.display = 'block'
    }
    text.classList.remove('hidden');
    if (i < textChars.length) {
      text.textContent += textChars.charAt(i);
      //console.log(text.textContent);
      
      i++;
      
      setTimeout(function(){ typeWriter('.dialogues-zone .' + text.className, wipe, speed); }, speed);
    }else{
        timeOut = setTimeout(function(){ text.classList.add('hidden');},4000);
        i = 0;
    }
  }
}