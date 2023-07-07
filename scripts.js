function foundCount() {
	var count = parseInt(wordCount);
	var length = parseInt(wordList.length);
	var result = isNaN(count) || isNaN(length) ? "Invalid input" : count - length;
	document.getElementById('left').textContent = "Found: " + result + "/" + count;
}
let inputField;

function shuffleArray(array) {
	return array.sort(() => Math.random() - 0.5);
}

function generateLetterCircle(mainWord) {
	const circleContainer = document.getElementById("letterCircle");
	circleContainer.innerHTML = "";
	const mainLetters = shuffleArray(mainWord.split(""));
	for(let i = 0; i < mainLetters.length; i++) {
		const letter = mainLetters[i];
		const angle = (360 / mainLetters.length) * i;
		const letterElement = document.createElement("span");
		letterElement.className = "letter";
		letterElement.style.transform = `rotate(${angle}deg) translate(100px) rotate(-${angle}deg)`;
		letterElement.textContent = letter;
		circleContainer.appendChild(letterElement);
	}
}

function getRandomWord(words) {
	let filteredWords = words.filter(word => {
		const letters = new Set(word);
		return letters.size === word.length;
	});
	if(filteredWords.length === 0) {
		throw new Error("No valid words found.");
	}
	return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function filterWords(words, targetWord) {
	const filteredWords = [];
	const targetLetters = targetWord.split('');
	for(let i = 0; i < words.length; i++) {
		const word = words[i].trim();
		if(word.length <= targetWord.length && isWordValid(word, targetLetters)) {
			filteredWords.push(word);
		}
	}
	return filteredWords;
}

function isWordValid(word, targetLetters) {
	const letters = word.split('');
	const letterCount = {};
	for(let i = 0; i < letters.length; i++) {
		const letter = letters[i];
		if(letterCount[letter]) {
			return false;
		}
		if(!targetLetters.includes(letter)) {
			return false;
		}
		letterCount[letter] = true;
	}
	return true;
}

function generateWordList(text) {
	const words = text.split('\n').filter(Boolean);
	const wordList = [];
	let targetWord, filteredWords;
	do {
		targetWord = getRandomWord(words).trim();
		filteredWords = filterWords(words, targetWord);
	} while (filteredWords.length < 3);
	wordList.push(targetWord);
	for(let i = 0; i < filteredWords.length; i++) {
		const word = filteredWords[i].trim();
		if(!wordList.includes(word)) {
			wordList.push(word);
		}
	}
	return wordList;
}
let wordList;
let wordCount;

function refresh() {
	const filename = 'allwords.txt';
	fetch(filename).then(response => response.text()).then(text => {
		wordList = generateWordList(text);
		wordCount = wordList.length;
		console.log(wordList);
		generateLetterCircle(wordList[0]);
		inputField.textContent = "";
		foundCount();
	}).catch(error => {
		console.error('Fehler beim Laden der Datei:', error);
	});
}
document.addEventListener('DOMContentLoaded', function() {
	function playAudio(name) {
		var audio = new Audio(name + ".mp3")
		audio.play();
	}
	inputField = document.getElementById("textField");

	function updateCounter() {
		let count = parseInt(getLocalStorage('callCount')) || 0;
		document.getElementById('count').textContent = "Level: " + count;
	}

	function setLocalStorage(key, value) {
		localStorage.setItem(key, value);
	}

	function getLocalStorage(key) {
		return localStorage.getItem(key);
	}
	updateCounter();

	function incrementCounter() {
		let count = parseInt(getLocalStorage('callCount')) || 0;
		count++;
		setLocalStorage('callCount', count);
		document.getElementById('count').textContent = "Level: " + count;
	}
	refresh();
	var circle = document.getElementById('touch_circle');
	var isDragging = false;

	function createTrail(x, y) {
		moveCircle(x - 10, y - 10);
		var elem = document.createElement("div");
		elem.setAttribute("class", "trail");
		elem.setAttribute("style", `left: ${x - 10}px; top: ${y - 10}px;`);
		elem.onanimationend = () => {
			elem.remove();
		};
		document.body.insertAdjacentElement("beforeend", elem);
	}
	document.addEventListener('mousedown', function(event) {
		if(event.button === 0) {
			showCircle(event.clientX, event.clientY);
			isDragging = true;
		}
	});
	document.addEventListener('mousemove', function(event) {
		if(isDragging) {
			createTrail(event.clientX, event.clientY);
			checkLetterCollision();
		}
	});
	document.addEventListener('mouseup', function(event) {
		if(event.button === 0) {
			hideCircle();
			isDragging = false;
		}
	});
	document.addEventListener('touchstart', function(event) {
		var touch = event.touches[0];
		showCircle(touch.clientX, touch.clientY);
		isDragging = true;
	});
	document.addEventListener('touchmove', function(event) {
		if(isDragging) {
			var touch = event.touches[0];
			createTrail(touch.clientX, touch.clientY);
			checkLetterCollision();
		}
	});
	document.addEventListener('touchend', function() {
		hideCircle();
		isDragging = false;
	});

	function showCircle(x, y) {
		circle.style.left = x + 'px';
		circle.style.top = y + 'px';
		circle.style.display = 'block';
	}

	function moveCircle(x, y) {
		circle.style.left = x + 'px';
		circle.style.top = y + 'px';
	}

	function hideCircle() {
		circle.style.display = 'none';
		var letters = document.getElementsByClassName('letter');
		for(var i = 0; i < letters.length; i++) {
			var letter = letters[i];
			letter.style.color = '';
			letter.classList.remove('used');
		}
		if(wordList.includes(inputField.textContent)) {
			console.log("yes");
			var element = document.getElementById('left');
			element.classList.add('shake', 'green');
			setTimeout(function() {
				element.classList.remove('shake');
				element.classList.remove('green');
			}, 1000);
			var index = wordList.indexOf(inputField.textContent);
			if(index > -1) {
				wordList.splice(index, 1);
			}
			foundCount();
			if(wordList.length == 0) {
				incrementCounter();
				refresh();
				playAudio("complete");
				const jsConfetti = new JSConfetti();
				jsConfetti.addConfetti()
			} else {
				playAudio("correct");
			}
		} else {
			console.log("no");
			if(inputField.textContent != "") {
				playAudio("incorrect");
			}
		}
		inputField.textContent = "";
	}

	function checkLetterCollision() {
		var letters = document.getElementsByClassName('letter');
		for(var i = 0; i < letters.length; i++) {
			var letter = letters[i];
			if(isColliding(circle, letter) && !letter.classList.contains('used')) {
				letter.classList.add('used');
				inputField.textContent += letter.textContent;
			}
		}
	}

	function isColliding(element1, element2) {
		var rect1 = element1.getBoundingClientRect();
		var rect2 = element2.getBoundingClientRect();
		return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
	}
});
