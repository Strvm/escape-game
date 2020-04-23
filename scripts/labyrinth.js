"use stric"
{
const { setFoundKey } = ESCAPE_ROOM;

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
        player.style.top = (parseFloat(player.style.top) - 3) + "%";
    }
    else if (event.key == "ArrowDown") {
        player.style.top = (parseFloat(player.style.top) + 3) + "%";
    }
    else if (event.key == "ArrowLeft") {
        player.style.left = (parseFloat(player.style.left) - 3) + "%";
    }
    else if (event.key == "ArrowRight") {
        player.style.left = (parseFloat(player.style.left) + 3) + "%";
    }
    const labyrinthe = document.querySelector("#labyrinthe");
    const labyrintheContainer = document.querySelector(".labyrintheContainer");
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
            player.style.left = "3%";
            return;
        }
    }
    const finish = document.querySelector("#finish");
    if (iscolliding(finish.getBoundingClientRect(), player.getBoundingClientRect())) {
        // TODO WIN
        document.querySelector(`.labyrinthContainer`).style.display = 'none';
        setFoundKey(true);
        console.log("WIN");
        
        return;
    }
});
}