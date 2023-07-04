document.addEventListener('touchstart', touchstartHandler, {passive: false});
document.addEventListener('touchmove', touchmoveHandler, {passive: false});


document.addEventListener('DOMContentLoaded', function() {


      




    var circle = document.getElementById('touch_circle');
    var isDragging = false;


    function createTrail(x, y) {
        moveCircle(x - 10 , y - 10);
    



        
        var elem = document.createElement("div");
        elem.setAttribute("class", "trail");
        elem.setAttribute("style", `left: ${x - 10}px; top: ${y - 10}px;`);
        elem.onanimationend = () => {
            elem.remove();
        }
        document.body.insertAdjacentElement("beforeend", elem);
    
    }
      




    const inputField = document.getElementById("textField");
    inputField.value = "";

    document.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
            showCircle(event.clientX, event.clientY);
            isDragging = true;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            createTrail(event.clientX, event.clientY)
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
            createTrail(touch.clientX, touch.clientY)

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

function generateRandomLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters.charAt(randomIndex);
}

function generateLetterCircle() {
    const circleContainer = document.getElementById("letterCircle");
    circleContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const letter = generateRandomLetter();
        const angle = (360 / 5) * i;

        const letterElement = document.createElement("span");
        letterElement.className = "letter";
        letterElement.style.transform = `rotate(${angle}deg) translate(100px) rotate(-${angle}deg)`;
        letterElement.textContent = letter;

        circleContainer.appendChild(letterElement);
    }
}

generateLetterCircle();
