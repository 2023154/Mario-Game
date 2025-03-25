document.addEventListener('DOMContentLoaded', () => {
    const mario = document.querySelector('.marioImg');
    const pipe = document.querySelector('.pipe');
    const scoreDisplay = document.querySelector('.score');
    const restartBtn = document.querySelector('.restart-btn');


    let score = 0;
    let gameOver = false;
    let isJumping = false;
    let velocity = 0;
    let gravity = -0.8;
    let position = 50;
    let isGrounded = true;
    let pipePassed = false;
    let pipeSpeed = 3000;
    let isHoldingJump = false;

    let animationFrame;
    const updateMarioPhysics = () => {
        // 🪂 gravidade reduzida enquanto segura espaço
        const effectiveGravity = (!isGrounded && isHoldingJump) ? -0.6 : -1.0;

        velocity += effectiveGravity;
        position += velocity;

        if (position <= 50) {
            position = 50;
            velocity = 0;
            isJumping = false;
            isGrounded = true;

            // Squish no chão
            mario.style.transform = 'scaleY(0.85)';
            setTimeout(() => {
                mario.style.transform = 'scaleY(1)';
            }, 100);
        }

        mario.style.bottom = `${position}px`;

        if (!isGrounded) {
            mario.style.transform = `rotate(${velocity * -2}deg)`;
        }

        animationFrame = requestAnimationFrame(updateMarioPhysics);
    };


    const jump = (event) => {
        if (event.code === 'Space' && !gameOver) {
            if (isGrounded) {
                velocity = 2;// Jump strength
                isJumping = true;
                isGrounded = false;
            }
        }
    };

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !gameOver) {
            isHoldingJump = true;

            if (isGrounded) {
                velocity = 20; // força do pulo
                isJumping = true;
                isGrounded = false;
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            isHoldingJump = false;
        }
    });

    const updatePipeSpeed = () => {
        pipe.style.animation = 'none';
        void pipe.offsetWidth;
        pipe.style.animation = `pipe-animation ${pipeSpeed / 1000}s infinite linear`;
    };

    const endGame = () => {
        restartBtn.style.display = 'block';

        if (gameOver) return;
        gameOver = true;

        cancelAnimationFrame(animationFrame);

        // Lock Mario
        const marioBottom = getComputedStyle(mario).bottom;
        mario.style.animation = 'none';
        mario.style.bottom = marioBottom;

        // Lock Pipe
        const pipeRect = pipe.getBoundingClientRect();
        const frameRect = pipe.parentElement.getBoundingClientRect();
        const pipeLeft = pipeRect.left - frameRect.left;

        pipe.style.animation = 'none';
        pipe.style.left = `${pipeLeft}px`;

        mario.src = 'mariodying.png';
        mario.style.width = '100px';
        mario.style.left = '30px';



        clearInterval(gameLoop);
    };

    restartBtn.addEventListener('click', () => {
        location.reload(); // Quick restart
    });


    const gameLoop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioBottom = parseFloat(getComputedStyle(mario).bottom);

        if (pipePosition <= 120 && pipePosition > 0 && marioBottom < 80) {
            endGame();
        }

        if (pipePosition <= 50 && !pipePassed) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;

            pipeSpeed = Math.max(800, pipeSpeed - 200);
            updatePipeSpeed();
            pipePassed = true;
        }

        if (pipePosition > 400) {
            pipePassed = false;
        }
    }, 10);

    updatePipeSpeed();
    updateMarioPhysics(); // Start physics loop
});
