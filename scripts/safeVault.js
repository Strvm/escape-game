
"use strict"
{
const { setFoundKey, getRoomId, getCurrentRoom} = ESCAPE_ROOM;
const pin = 810
let enterCode = '';
let isUnlocked = false;

document.querySelector('.pincode').addEventListener('click', (event) => {
	if (event.target.className.includes('button')){
		const clickedNumber = event.target.innerText;
		
		console.log(clickedNumber)
		
		enterCode = enterCode + clickedNumber
		let lengthCode = enterCode.length
		lengthCode--
		document.querySelector(`.fields .c${lengthCode} .numberfield`).classList.add('active');
		document.querySelector('.textContainer .text').innerHTML = `<strong>Il faut entrer un code...</strong>`;
		if (lengthCode == 2) {
			// Check if the code is correct.
			if (enterCode == pin) {

			// If the code is correct, do this :
			document.querySelector(`.fields .c${lengthCode} .numberfield`).classList.add('active');
			document.querySelector('.numbers').classList.add('hide');
			document.querySelector('.keyWin').style.display = 'block';
			document.querySelector('.textContainer .text').display = 'none';
			document.querySelector('.textContainer .text').innerHTML = ``
			isUnlocked = true;
			setTimeout(function () {
				document.querySelector(`.safeVaultContainer`).style.display = 'none';
			}, 1000)
			setFoundKey(true);
			} 
			else {
			// If the code entered is wrong.
			enterCode = '';
			document.querySelector('.fields').classList.add('miss')
			document.querySelector(`.fields .c${lengthCode} .numberfield`).classList.remove('right')
			document.querySelector(`.fields .c0 .numberfield`).classList.remove('active')
			document.querySelector(`.fields .c1 .numberfield`).classList.remove('active')
			document.querySelector(`.fields .c2 .numberfield`).classList.remove('active')
			document.querySelector('.numbers').classList.remove('hide')
			document.querySelector('.textContainer .text').innerHTML = `<strong>Vous n'avez pas trouvé le bon code... !</strong>`

			setTimeout(function () {
				document.querySelector(`.fields .c${lengthCode} .numberfield`).classList.remove('active')
				}, 200)
				setTimeout(function () {
				document.querySelector('.fields').classList.remove('miss')
				}, 500)
			}
		} 
	}else if(event.target.className.includes('close')){
		const level =  document.querySelector(`.level-${getRoomId(getCurrentRoom())}`) 
		const img = new Image();
		document.querySelector(`.safeVaultContainer`).style.display = 'none';
		if(!isUnlocked)
			img.src = img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg`;
		else
			img.src = img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/coffreOuvert.svg`;
		img.onload = function(){ 
			level.style.backgroundImage = `url("${img.src}")`;
		}
	}
});

}