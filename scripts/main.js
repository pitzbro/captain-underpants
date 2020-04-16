(function () {

    var 
        captainPosTop = 0,
        captainSpeed = 20,
        enemyId = 0,
        level = 1,
        score = 0,
        time = 0;
        
        function initGame() {
            
        const
        game = document.querySelector('.game'),
        scoreEl = document.querySelector('.score-board .score'),
        captain = document.querySelector('.captain'),
        btnRestart = document.querySelector('.restart-game'),
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

        // Buttons

        btnRestart.onclick = () => restartGame();

        // Game States

        function gameEnd() {
            console.log('game end')
        }

        function restartGame() {
            resetTimer();
        }

        // Movement

        var movingDirection = 'center'
        var goingDown = null;
        var goingUp = null;

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
                points: 200
            }
        }
        // createEnemy();
        function createEnemy(enemy) {
            enemyId++;
            var enemy = enemies[enemy];
            var enemyYPos = randomIntFromInterval(0, 100 - enemy.height);
            var enemyEl = document.createElement('enemy');
            enemyEl.className = `enemy-${enemyId} ${enemy.type}`;
            enemyEl.setAttribute('data-type', enemy.type);
            enemyEl.style.top = enemyYPos + '%';
            game.appendChild(enemyEl);
            enemy.el = enemyEl;
            initEnemy(enemyEl);
        }

        function initEnemy(enemy) {

            var enemyXPos = 0;
            var enemyYPos = Number(enemy.style.top.replace('%', ''));
            var enemyData = enemies[enemy.dataset.type];

            var movingEnemy =  setInterval(()=> {
                enemyXPos++
                if (enemyXPos > 150) {
                    removeEnemy(enemy)
                    clearInterval(movingEnemy)
                }
                if (enemyXPos > 70 && 
                    enemyXPos < 80 && 
                    enemyYPos >= captainPosTop && 
                    enemyYPos <= captainPosTop + 15 && 
                    captain.classList.contains('punch') ) {
                    updateScore(enemyData.points)
                    destroyEnemy(enemy)
                    clearInterval(movingEnemy)
                }
                // if (enemyXPos === 80 && !captain.classList.contains('punch')) hitCaptain();

                enemy.style.right = enemyXPos + '%';

            }, randomIntFromInterval(16, 30))
            
            // temp
            // enemy.style.right = '50%';

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

            console.log('updating level', levels[level - 1])

            if (!levels[level - 1]) {
                gameEnd();
                return
            }

            game.setAttribute('data-mode', levels[level - 1].mode);

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
                setTimeout( createEnemy.bind(null, type), randomIntFromInterval(1000, levelTime));
            }
        }

        // Timer

        const stopWatch = document.querySelector('.stop-watch');

        var seconds = 0, minutes = 0, t;

        function resetTimer() {
            seconds = 0;
            minutes = 0;
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
        initGame()
    });

})()