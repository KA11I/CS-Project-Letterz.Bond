document.addEventListener('DOMContentLoaded', function() {
    function updateCounter() {
        // Get the current count from local storage or set it to 0 if not present
        let count = parseInt(getLocalStorage('callCount')) || 0;

        // Display the count on the webpage
        document.getElementById('count').textContent = count;
    }

    // Function to set a value in local storage
    function setLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    // Function to get a value from local storage
    function getLocalStorage(key) {
        return localStorage.getItem(key);
    }

    // Call the function on page load
    updateCounter();

    // Rest of your code...

    // Function to increment the counter and update it in local storage
    function incrementCounter() {
        // Get the current count from local storage or set it to 0 if not present
        let count = parseInt(getLocalStorage('callCount')) || 0;

        // Increment the count
        count++;

        // Set the updated count in local storage
        setLocalStorage('callCount', count);

        // Display the count on the webpage
        document.getElementById('count').textContent = count;
    }
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function generateLetterCircle(mainWord) {
        const circleContainer = document.getElementById("letterCircle");
        circleContainer.innerHTML = "";

        const mainLetters = shuffleArray(mainWord.split(""));

        for (let i = 0; i < mainLetters.length; i++) {
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
        return words[Math.floor(Math.random() * words.length)];
    }

    function filterWords(words, targetWord) {
        const filteredWords = [];
        const targetLetters = targetWord.split('');

        for (let i = 0; i < words.length; i++) {
            const word = words[i].trim();
            if (word.length <= targetWord.length && isWordValid(word, targetLetters)) {
                filteredWords.push(word);
            }
        }

        return filteredWords;
    }

    function isWordValid(word, targetLetters) {
        const letters = word.split('');
        const letterCount = {};

        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];

            // Check if the letter is already present in the word
            if (letterCount[letter]) {
                return false;
            }

            // Check if the letter is not included in the target letters
            if (!targetLetters.includes(letter)) {
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
            targetWord = getRandomWord(words).trim(); // Trim the target word to remove the carriage return character
            filteredWords = filterWords(words, targetWord);
        } while (filteredWords.length < 3);

        wordList.push(targetWord);
        for (let i = 0; i < filteredWords.length; i++) {
            const word = filteredWords[i].trim();
            if (!wordList.includes(word)) {
                wordList.push(word);
            }
        }

        return wordList;
    }


    const inputField = document.getElementById("textField");

    let wordList;
    let wordCount;
function refresh(){
    const filename = 'allwords.txt'; // Name der Textdatei
    fetch(filename)
        .then(response => response.text())
        .then(text => {
            wordList = generateWordList(text);
            wordCount = wordList.length;
            console.log(wordList);
            generateLetterCircle(wordList[0]);
            inputField.value = "";

        })
        .catch(error => {
            console.error('Fehler beim Laden der Datei:', error);
        });
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
        if (event.button === 0) {
            showCircle(event.clientX, event.clientY);
            isDragging = true;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            createTrail(event.clientX, event.clientY);
            checkLetterCollision();
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 0) {
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
        if (isDragging) {
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
        for (var i = 0; i < letters.length; i++) {
            var letter = letters[i];
            letter.style.color = '';
            letter.classList.remove('used');
        }
    
        if (wordList.includes(inputField.value)) {
            console.log("yes");
            var index = wordList.indexOf(inputField.value);
            if (index > -1) {
                wordList.splice(index, 1);
            }
            console.log(wordList.length +"/" + wordCount)
            if (wordList.length == 0){
                incrementCounter();
                refresh();
            }
        } else {
            console.log("no");
        }
        inputField.value = "";
    }
    

    function checkLetterCollision() {
        var letters = document.getElementsByClassName('letter');
        for (var i = 0; i < letters.length; i++) {
            var letter = letters[i];
            if (isColliding(circle, letter) && !letter.classList.contains('used')) {
                letter.style.color = 'red';
                letter.classList.add('used');
                inputField.value += letter.textContent;
            } else {
                letter.style.color = '';
            }
        }
    }

    function isColliding(element1, element2) {
        var rect1 = element1.getBoundingClientRect();
        var rect2 = element2.getBoundingClientRect();
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }
});
