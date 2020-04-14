(function () {


    function initGame() {

        const
            game = document.querySelector('.game'),
            scoreEl = document.querySelector('.score-board .score'),
            captain = document.querySelector('.captain');

        var 
            captainPosTop = 0,
            captainSpeed = 20,
            enemyId = 0,
            score = 0;
        //Initialise game
        // facing = "E"; //N = North, E = East, S = South, W = West
        // isMoving = false;

        // gameloop = setInterval(update, TIME_PER_FRAME);	


        //------------
        //Key Handlers
        //------------
        document.addEventListener('keydown', keyDownHandler, false);
        // document.addEventListener("keyup",keyUpHandler, false);	
        function keyDownHandler(ev) {
            var keyPressed = String.fromCharCode(event.keyCode);
            console.log('keyPressed', keyPressed);

            switch (keyPressed) {
                case '(': moveCaptain('down')
                    break;
                case '&': moveCaptain('up')
                    break;
                case ' ': punch()
                    break;
                case 'C': createEnemy()
                    break;
                default:
                // code block
            }
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
            // 'yossef': {
            //     width: 8,
            //     height: 8,
            // }
        }
        createEnemy();
        function createEnemy(enemy) {
            enemyId++;
            var enemyNumber = randomIntFromInterval(0, Object.keys(enemies).length - 1);
            var enemy = Object.entries(enemies)[enemyNumber][1];
            var enemyYPos = randomIntFromInterval(0, 100 - enemy.height);
            var enemyEl = document.createElement('enemy');
            enemyEl.className = `enemy-${enemyId} ${enemy.type}`;
            enemyEl.setAttribute('data-type', enemy.type);
            enemyEl.style.top = enemyYPos + '%';
            game.appendChild(enemyEl);
            enemy.el = enemyEl;
            console.log('enemy', enemy)
            initEnemy(enemyEl);
        }

        function initEnemy(enemy) {

            var enemyXPos = 0;
            var enemyYPos = Number(enemy.style.top.replace('%', ''));
            var enemyData = enemies[enemy.dataset.type];

            console.log(enemyData)

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
            console.log('points', points)
            scoreEl.innerText = score;
        }

    }




    window.addEventListener('DOMContentLoaded', event => {
        initGame()
    });
})()