(function () {


    function initGame() {

        const
            game = document.querySelector('.game'),
            captain = document.querySelector('.captain');

            console.log('captain', captain)

            captain.style.top = 

            console.log('moving down', captain.style)

        var captainPosTop = 0;
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
                case '(':
                    moveCaptain('down')
                    break;
                case '&': moveCaptain('up')
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
                if (movingDirection !== 'down' && captainPosTop <= 85) goingDown = setInterval(moveDown, 100)
                movingDirection = 'down';
            }
            else if (direction === 'up') {
                clearInterval(goingDown)
                if (movingDirection !== 'up' && captainPosTop >= 0) goingUp = setInterval(moveUp, 100)
                movingDirection = 'up';
            }
        }
    }




    window.addEventListener('DOMContentLoaded', event => {
        initGame()
    });
})()