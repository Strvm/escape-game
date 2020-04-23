const pin = 123
let enterCode = ''

document.querySelector('.numbers').addEventListener('click', (event) => {
	if (!event.target.className.includes('button'))return;
	const clickedNumber = event.target.innerText;
	
	console.log(clickedNumber)
	enterCode = enterCode + clickedNumber
	let lengthCode = enterCode.length
	lengthCode--
	document.querySelectorAll('.fields .numberfield').classList.add('active')

	if (lengthCode == 2){
		// Check if the code is correct
		if (enterCode == pin) {

		// If the code is correct, do this :
		document.querySelector('.fields .numberfield').classList.add('right')
		document.querySelector('.numbers').classList.add('hide')
		document.querySelector('.text').innerHTML = `<strong>J'ai trouvé le code !</strong>`
		} 
		
	else{
		// If the code entered is wrong
		enterCode = '';
		document.querySelector('.fields').classList.add('miss')
		document.querySelector('.fields .numberfield').classList.remove('right')
		document.querySelector('.numbers').classList.remove('hide')
		document.querySelector('.text').innerHTML = `<strong>Ça n'a pas l'air d'être le bon code... !</strong>`

		setTimeout(function () {
			document.querySelector('.fields .numberfield').classList.remove('active')
			}, 200)
			setTimeout(function () {
			document.querySelector('.fields').classList.remove('miss')
			}, 500)
		}
	} 

});