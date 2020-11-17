document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    for(var i = 0; i < 200; i++){ grid.innerHTML +=  '<div></div>'; }
    for(var i = 0; i < 10; i++){ grid.innerHTML +=  '<div class="taken"></div>'; }
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const pauseBtn = document.getElementById('pause-button');
    const gameOverText = document.getElementById("game-over");
    const width = 10;
    let score = 0;
    let timerId;
    let tetroColors = [
        "black",
        "#181818",
        "#282828",
        "#383838",
        "#484848"
    ];
    
    //Tetros
    const theTetros = [
        [//lTetromino
            [1, width+1, width*2+1, 2],
            [width, width+1, width+2, width*2+2],
            [1, width+1, width*2+1, width*2],
            [width, width*2, width*2+1, width*2+2]
        ],
        [//zTetromino
            [width+1, width+2, width*2, width*2+1],
            [0, width, width+1, width*2+1],
            [width+1, width+2, width*2, width*2+1],
            [0, width, width+1, width*2+1]
        ],
        [//tTetromino
            [1, width, width+1, width+2],
            [1, width+1, width+2, width*2+1],
            [width, width+1, width+2, width*2+1],
            [1, width, width+1, width*2+1]
        ],
        [//oTetromino
            [0,1,width,width+1],
            [0,1,width,width+1],
            [0,1,width,width+1],
            [0,1,width,width+1]
        ],
        [//iTetromino
            [1, width+1, width*2+1, width*3+1],
            [width, width+1, width+2, width+3],
            [1, width+1, width*2+1, width*3+1],
            [width, width+1, width+2, width+3]
        ]
    ];
    
    let currentPosition = 4;
    let currentRotation = 0;
    let nextRandom = Math.floor(Math.random()*theTetros.length);
    let random = Math.floor(Math.random()*theTetros.length);
    let current = theTetros[random][currentRotation];


    //Drawing current Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].style.backgroundColor = tetroColors[random];
        })
    }
    //Removing current Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }


    // Drop Rate Interval
    function dropDown(){
        freeze();
        undraw();
        currentPosition += width;
        draw();
    }
    // Bottom Collision Test (FREEZE)
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetros.length);
            current = theTetros[random][currentRotation];
            currentPosition = 4;
            addScore();
            draw();
            displayShape();
            gameOver();
        }
    }


    // Arrow Keys
    document.addEventListener('keydown', moveFunc);
    function moveFunc(e){
        if(e.key === "ArrowLeft" && pauseBtn.textContent === "||") moveLeft();
        if(e.key === "ArrowRight" && pauseBtn.textContent === "||") moveRight();
        if(e.key === "ArrowDown" && pauseBtn.textContent === "||") moveDown();
        if(e.key === "ArrowUp" && pauseBtn.textContent === "||") rotate();
    }
    function moveLeft(){
        undraw();
        const atLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if(!atLeftEdge) currentPosition -= 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1;
        }
        draw();
    }
    function moveRight(){
        undraw();
        const atRightEdge = current.some(index => (currentPosition + index - 9) % width === 0);
        if(!atRightEdge) currentPosition += 1;
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1;
        }
        draw();
    }
    function moveDown(){
        const colTest = current.some(index => squares[currentPosition + index + width].classList.contains('taken'));
        if(!colTest) {
            undraw();
            currentPosition += width;
            draw();
        }
    }
    function rotate(){
        let rotation;
        currentRotation < 3 ? rotation = currentRotation + 1:rotation = 0;
        // Collision Check Right Side
        let colTest1 = current.some(index => String(currentPosition + index).endsWith("9") && theTetros[random][rotation].some(i=> String(currentPosition + i).endsWith("0")));
        let colTest2 = current.some(index => String(currentPosition + index).endsWith("8") && theTetros[random][rotation].some(i=> String(currentPosition + i).endsWith("0")));
        // Collision Check Left Side
        let colTest3 = current.some(index => String(currentPosition + index).endsWith("0") && theTetros[random][rotation].some(i=> String(currentPosition + i).endsWith("9")));
        // Changing Rotation
        if(!colTest1 && !colTest2 && !colTest3){
            currentRotation < 3 ? currentRotation++:currentRotation = 0;
            undraw();
            current = theTetros[random][currentRotation];
            draw();
        }
    }

    ///////Mini-Grid////////
    const miniGrid = document.querySelector('.mini-grid');
    for(let i = 0; i < 16; i++){ miniGrid.innerHTML += '<div></div>'; }  
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    // Tetro Shapes
    const nextTetros = [
        [1, displayWidth+1, displayWidth*2+1, 2],//lTetro
        [1, 2, displayWidth, displayWidth+1],//zTetro
        [1, displayWidth+1, displayWidth+2, displayWidth*2+1],//tTetro
        [1,2,displayWidth+1,displayWidth+2],//oTetro
        [0, 1, 2, 3]//iTetro
    ];

    // Display Next Tetro Shape
    function displayShape(){
        displaySquares.forEach(index => index.classList.remove('tetromino'));
        nextTetros[nextRandom].forEach(index => displaySquares[displayIndex + index].classList.add('tetromino'));
    }
    ///////End Mini-Grid///////


        // New Game Button
    startBtn.addEventListener('click', startGame);
    function startGame(){
        squares.forEach(x=> x.style.backgroundColor = '');
        gameOverText.innerHTML = "";
        gameOverText.style.backgroundColor = "";
        for(let i=0; i<200; i++){
            squares[i].classList.remove('taken');
        }
        undraw();
        currentPosition = 4;
        draw();
        score = 0;
        scoreDisplay.innerHTML = score;
        pauseBtn.textContent = "||";
        clearInterval(timerId);
        timerId = setInterval(dropDown, 500);
        nextTetros[nextRandom].forEach(index => displaySquares[displayIndex + index].classList.add('tetromino'));
        document.getElementById("game-over").innerHTML = "";
    }


        // Pause Buttton
    pauseBtn.addEventListener('click', pauseGame);
    function pauseGame(){
        if(pauseBtn.textContent === "||"){
            clearInterval(timerId);
            pauseBtn.textContent = ">";
        } else {
            timerId = setInterval(dropDown, 500);
            pauseBtn.textContent = "||";
        }
    }

    // Add Score
    function addScore(){
        for(let i = 0; i<199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                scoreDisplay.style.color = "darkgreen";
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell=> grid.appendChild(cell));

            }
        }
    }

    
    // Game Over
    function gameOver(){
        if(current.some(index=> squares[currentPosition + index + width].classList.contains('taken'))){
            clearInterval(timerId);
            gameOverText.innerHTML = "Game Over!";
            gameOverText.style.backgroundColor = "black";
        }
    }

})