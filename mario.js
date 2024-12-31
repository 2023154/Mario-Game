document.addEventListener('DOMContentLoaded', () => {
    const mario = document.querySelector('.marioImg');
    const pipe = document.querySelector('.pipe');
    const bird = document.querySelector('.bird');
    const scoreDisplay = document.querySelector('.score');
    let score = 0;

    let isJumping = false; // To track if Mario is already in the air
    let doubleJumped = false; // To track if a double jump has occurred

    let pipePassed = false; // Flag to detect when pipe resets

    const performSingleJump = () => {
        console.log("Jump triggered");
        isJumping = true;
        mario.classList.add('jumpAnimation');
        setTimeout(() => {
            mario.classList.remove('jumpAnimation');
            isJumping = false;
            doubleJumped = false;
        }, 600);
    };
    
    const performDoubleJump = () => {
        console.log("Double jump triggered");
        isJumping = true;
        doubleJumped = true;
        mario.classList.add('doubleJump');
        setTimeout(() => {
            mario.classList.remove('doubleJump');
        }, 2000);
    };
    
    const jump = (event) => {
        if (event.code === 'Space') {
            if (!isJumping) {
                performSingleJump();
            } else if (!doubleJumped) {
                performDoubleJump();
            }
        }
    };

    // Attach jump to the spacebar key
    document.addEventListener('keydown', jump);

    const loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
        const birdPosition = bird.offsetLeft;
        const birdBottom = parseInt(window.getComputedStyle(bird).bottom.replace('px', ''));

        const marioHeight = 150; // Approx height of Mario
        const birdHeight = 100; // Approx height of the bird

        const marioTop = marioPosition + marioHeight;
        const birdTop = birdBottom + birdHeight;

        // Collision with pipe
        if (pipePosition <= 120 && marioPosition < 80 && pipePosition > 0) {
            // Game over logic for pipe collision
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;

            bird.style.animation = 'none';
            bird.style.left = `${birdPosition}px`;

            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;
            // mario.style.bottom = `${marioPosition}px`;

            mario.src = 'mariodying.png';
            mario.style.width = '100px';
            mario.style.left = '30px';

            clearInterval(loop);
        }

        // Collision with bird
        if (
            birdPosition <= 120 && birdPosition > 0 && // Horizontal collision
            marioTop > birdBottom && marioPosition < birdTop // Vertical collision
        ) {
            // Game over logic for bird collision
            bird.style.animation = 'none';
            bird.style.left = `${birdPosition}px`;
            pipe.style.left = `${pipePosition}px`;

            pipe.style.animation = 'none';

            mario.src = 'mariodying.png';
            mario.style.width = '100px';
            mario.style.left = '30px';

            clearInterval(loop); // Stop the game loop
        }

        // Scoring logic
        if (pipePosition <= 0 && !pipePassed) {
            score++; // Increment the score
            scoreDisplay.textContent = `Score: ${score}`; // Update the score display
            pipePassed = true; // Ensure the score increments only once per reset
        }

        // Reset the flag when the pipe comes back on screen
        if (pipePosition > 0) {
            pipePassed = false;
        }
    }, 10);
    console.log()
});
