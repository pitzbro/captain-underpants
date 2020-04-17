(function () {

    const
        stopWatch = document.querySelector('.stop-watch'),
        btnStart = document.querySelector('.btn-start');
        bestScoreEl = document.querySelector('.game-actions .best-score');

    let captainPosTop = 0,
        captainSpeed = 20,
        enemySpeedRange = [16, 30],
        enemyId = 0,
        level = 1,
        score = 0,
        time = 0,
        seconds = 0,
        minutes = 0,
        t = null,
        goingDown = null,
        goingUp = null,
        movingDirection = 'center',
        bestScore = localStorage.getItem('bestScore') ? localStorage.getItem('bestScore') : 0;


    function initApp() {
        // Buttons
        btnStart.onmousedown = () => initGame();
        bestScoreEl.innerText = bestScore;
    }

    function setBestScore(score) {
        bestScore = score;
        bestScoreEl.innerText = bestScore;
        localStorage.setItem('bestScore', score)
    }

    function initGame() {

        document.body.classList.add('game-on');

        const
            game = document.querySelector('.game'),
            gameContainer = document.querySelector('.game-container'),
            scoreEl = document.querySelector('.score-board .score'),
            captain = document.querySelector('.captain'),
            levelTime = 30000;
        // levelTime = 5000;

        //------------
        //Key Handlers
        //------------
        document.addEventListener('keydown', keyDownHandler, false);
        function keyDownHandler(ev) {
            var keyPressed = String.fromCharCode(event.keyCode);

            switch (keyPressed) {
                case '(': moveCaptain('down')
                    break;
                case '&': moveCaptain('up')
                    break;
                case ' ': punch()
                    break;
                case 'C': createEnemy('asteroid')
                    break;
                default:
                // code block
            }
        }



        // Game States

        function gameEnd() {
            resetTimer();
            if (score > bestScore) {
                setBestScore(score);
                document.querySelector('.not-best-score').style.display = 'none';
                document.querySelector('.score-info .best-score').style.display = 'block';
            } else {
                document.querySelector('.not-best-score').style.display = 'block';
                document.querySelector('.score-info .best-score').style.display = 'none';
            }
            document.querySelector('.your-score').innerText = score;
            document.body.classList.remove('game-on');
            gameContainer.setAttribute('data-mode', 'end');
        }

        // Movement

        function moveDown() {
            captainPosTop++
            if (captainPosTop <= 85) captain.style.top = captainPosTop + '%';
            else clearInterval(goingDown)

        }
        function moveUp() {
            captainPosTop--
            if (captainPosTop >= 0) captain.style.top = captainPosTop + '%';
            else clearInterval(goingUp)
            movingDirection = 'up';
        }
        function moveCaptain(direction) {
            if (direction === 'down') {
                clearInterval(goingUp)
                if (movingDirection !== 'down' && captainPosTop <= 85) goingDown = setInterval(moveDown, captainSpeed)
                movingDirection = 'down';
            }
            else if (direction === 'up') {
                clearInterval(goingDown)
                if (movingDirection !== 'up' && captainPosTop >= 0) goingUp = setInterval(moveUp, captainSpeed)
                movingDirection = 'up';
            }
        }
        function punch() {
            captain.classList.add('punch');
            playSound('swish1');
            setTimeout(() => {
                captain.classList.remove('punch');
            }, 200);
        }


        // Enemies

        const enemies = {
            'asteroid': {
                type: 'asteroid',
                width: 12,
                height: 12,
                points: 100
            },
            'underpants': {
                type: 'underpants',
                width: 10,
                height: 10,
                points: 300
            },
            'house': {
                type: 'house',
                width: 10,
                height: 20,
                points: 50
            },
            'building': {
                type: 'building',
                width: 10,
                height: 59,
                points: 50
            },
            'choper': {
                type: 'choper',
                width: 17,
                height: 22,
                points: 50
            },
            'spaceship': {
                type: 'spaceship',
                width: 22,
                height: 20,
                points: 50
            }
        }


        function createEnemy(enemy) {
            enemyId++;
            var enemy = enemies[enemy];
            var enemyEl = document.createElement('enemy');
            enemyEl.className = `enemy-${enemyId} ${enemy.type}`;
            enemyEl.setAttribute('data-type', enemy.type);
            var enemyYPos = 0;
            switch (enemy.type) {
                case 'house':
                    enemyYPos = 100 - enemy.height;
                    break;
                case 'building':
                    enemyYPos = 100 - enemy.height;
                    break;
                case 'choper':
                    enemyYPos = randomIntFromInterval(0, 16);
                    break;
                default:
                    enemyYPos = randomIntFromInterval(0, 100 - enemy.height);
            }
            // var enemyYPos = randomIntFromInterval(0, 100 - enemy.height);
            enemyEl.style.top = enemyYPos + '%';
            game.appendChild(enemyEl);
            enemy.el = enemyEl;
            initEnemy(enemyEl);
        }

        function initEnemy(enemy) {

            var enemyXPos = 0;
            var enemyYPos = Number(enemy.style.top.replace('%', ''));
            var enemyData = enemies[enemy.dataset.type];

            var movingEnemy = setInterval(() => {
                enemyXPos++
                if (enemyXPos > 150) {
                    removeEnemy(enemy)
                    clearInterval(movingEnemy)
                }
                if (enemyXPos > 70 &&
                    enemyXPos < 80 &&
                    enemyYPos >= captainPosTop - enemyData.height &&
                    enemyYPos <= captainPosTop + 15 &&
                    captain.classList.contains('punch')) {
                    updateScore(enemyData.points)
                    destroyEnemy(enemy)
                    clearInterval(movingEnemy)
                }
                if (enemyData.type !== 'underpants' &&
                    // enemyData.type !== 'asteroid' &&
                    enemyXPos > 80 &&
                    enemyXPos < 90 &&
                    enemyYPos >= captainPosTop - enemyData.height &&
                    enemyYPos <= captainPosTop + 15 &&
                    !captain.classList.contains('punch')) {
                    hitCaptain();
                }

                enemy.style.right = enemyXPos + '%';

            }, randomIntFromInterval(...enemySpeedRange))

            // enemy.style.right = '50%'; // temp
            
        }

        // createEnemy('spaceship'); // TEMP

        function hitCaptain() {
            if(gameContainer.dataset.mode !== 'end') gameEnd();
        }

        function removeEnemy(enemy) {
            enemy.remove();
        }
        function destroyEnemy(enemy) {
            enemy.classList.add('boom');
            playSound(`pam${randomIntFromInterval(1, 4)}`)
            setTimeout(() => enemy.remove(), 200);
        }


        // ---------- SCORE -------------- //

        function updateScore(points) {
            score = score + points;
            scoreEl.innerText = score;
        }

        // ---------- LEVEL -------------- //

        const levelEl = document.querySelector('.level-info .level')
        
        updateLevel()

        function updateLevel() {

            if (!levels[level - 1]) {
                gameEnd();
                return
            }

            gameContainer.setAttribute('data-mode', levels[level - 1].mode);

            levelEl.innerText = level;

            Object.entries(levels[level - 1].enemies).forEach((entrie, idx) => {
                var type = entrie[0];
                var number = entrie[1];
                if (type !== 'level') {
                    for (var i = 0; i < number; i++) {
                        enemyDelay(type)
                    }
                }
            })

            function enemyDelay(type) {
                setTimeout(createEnemy.bind(null, type), randomIntFromInterval(1000, levelTime - (enemySpeedRange[1] * 100)));
            }
        }

        // Timer

        function resetTimer() {
            seconds = 0;
            minutes = 0;
            time = 0;
            stopWatch.textContent = '00:00';
            clearInterval(t);
        }

        function tick() {
            time++
            seconds++;
            if (time * 1000 === levelTime * level) {
                level++;
                updateLevel();
            }
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }

            stopWatch.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

            startTimer();
        }

        function startTimer() {
            t = setTimeout(tick, 1000);
        }

        startTimer();
    }

    window.addEventListener('DOMContentLoaded', event => {
        initApp()
    });

})()