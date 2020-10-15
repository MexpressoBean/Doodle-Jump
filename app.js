
// Load JS only once all HTML has been written
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid'); // Grabs the grid class from html
    const doodler = document.createElement('div'); // Create new div for the doodler

    let platforms = []; // array that stores the platforms
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let upTimerId;
    let downTimerId;
    let leftTimerId;
    let rightTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let score = 0;


    // Function that adds the doodler into the grid
    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = `${doodlerLeftSpace}px`;
        doodler.style.bottom = `${doodlerBottomSpace}px`;
    }


    // Platform class
    class Platform{
        constructor(newPlatBottom){
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315; // Within this range the platform will appear in the grid
            this.visual = document.createElement('div');
    
            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = `${this.left}px`;
            visual.style.bottom = `${this.bottom}px`;
            grid.appendChild(visual);
        }
    } // END class Platform


    // Function that adds platforms into the grid
    function createPlatforms(){
        for(let i = 0; i < platformCount; i++){
            let platformGap = 600 / platformCount; // space between platforms (height of the grid / the number of platforms)
            let newPlatBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
            console.log(platforms);
        }
    }


    // Function that moves the platforms down as the doodler jumps up
    function movePlatforms(){
        if(doodlerBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -=4;

                let visual = platform.visual; // platform div
                visual.style.bottom = `${platform.bottom}px`;

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    score++;

                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            });
        }
    }

    
    // Function that allows the doodler to jump
    function jump(){
        clearInterval(downTimerId); 
        isJumping = true;
        upTimerId = setInterval(function() {
            doodlerBottomSpace += 20; // set the style attribute
            doodler.style.bottom = `${doodlerBottomSpace}px`// apply the style attribute to the doodler
            if(doodlerBottomSpace > startPoint + 200)
            {
                fall();
            }
        
        }, 20);
    }

    // Function that makes the doodler fall down
    function fall(){
        clearInterval(upTimerId); // stops the doodler from going upwards still
        isJumping = false;
        downTimerId = setInterval(function() {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = `${doodlerBottomSpace}px`;

            if(doodlerBottomSpace <= 0){
                gameOver();
            }

            platforms.forEach(platform => {
                if( (doodlerBottomSpace >= platform.bottom) && 
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) && 
                    (!isJumping) ) 
                {
                    console.log('landed');     
                    startPoint = doodlerBottomSpace
                    jump();
                } 
            })
        },20);
    }


    // Function that sets game over
    function gameOver(){
        console.log('Game Over');
        isGameOver = true;

        while(grid.firstElementChild){
            grid.removeChild(grid.firstChild);
        }

        grid.innerHTML = score;
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }


    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5;
                doodler.style.left = `${doodlerLeftSpace}px`;
            } else{
                moveRight();
            }

        },20);
    }



    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5;
                doodler.style.left = `${doodlerLeftSpace}px`;
            } else{
                moveLeft();
            }

        },20);
    }


    function moveStraight(){
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }


    // Function that handles the user control for the doodler
    function control(e){
        if(e.key == "ArrowLeft"){
            moveLeft();
        }
        else if(e.key == "ArrowRight"){
            moveRight();
        }
        else if(e.key == "ArrowUp"){
            moveStraight();
        }
    }

    // Function that starts the doodle jump game
    function start(){
        if(!isGameOver)
        {
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keyup', control);
        }
    }

    start(); // execute function  that starts the game
    
});// END document.addEventListener('DOMContentLoaded', () =>{}