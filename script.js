const sky = document.getElementById("sky");
const numberOfStars = 100;

for (let i = 0; i < numberOfStars; i++) {
  const star = document.createElement("div");
  star.className = "star";

  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.right = `${Math.random() * 100}%`;
  star.style.bottom = `${Math.random() * 100}%`;
  sky.appendChild(star);
}

const porty = document.getElementById("porty");
const text = porty.textContent;
porty.textContent = "";

text.split("").forEach((char, index) => {
  const span = document.createElement("span");
  span.textContent = char;
  span.style.animationDelay = `${index * 0.1}s`;
  porty.appendChild(span);
});

function createShootingStar() {
  const shootingStar = document.createElement("div");
  shootingStar.className = "shooting-star";
  shootingStar.style.left = Math.random() * window.innerWidth * 0.5 + "px";
  shootingStar.style.top = Math.random() * window.innerHeight * 0.5 + "px";
  shootingStar.style.animationDelay = Math.random() * 5 + "s";
  document.body.appendChild(shootingStar);

  setTimeout(() => {
    shootingStar.remove();
  }, 1000);
}

setInterval(createShootingStar, 1000);

const words = ["infy!", "a developer!"];
let currentWord = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 300;
const pause = 2000;
const lastWordElement = document.getElementById("lastWord");

function typeEffect() {
  const current = words[currentWord];
  if (!isDeleting) {
    charIndex++;
    lastWordElement.textContent = current.substring(0, charIndex);
    lastWordElement.style.width = charIndex + "ch";
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, pause);
      return;
    }
  } else {
    charIndex--;
    lastWordElement.textContent = current.substring(0, charIndex);
    lastWordElement.style.width = charIndex + "ch";
    if (charIndex === 0) {
      isDeleting = false;
      currentWord = (currentWord + 1) % words.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 400 : speed);
}

typeEffect();

const openBtn = document.getElementById("i");

const dialog = document.getElementById("main-dialog");

openBtn.addEventListener("click", () => {
  dialog.showModal();
});

const closeBtn = document.getElementById("close-i-button");
closeBtn.addEventListener("click", () => {
  dialog.classList.add("closing");

  dialog.addEventListener(
    "animationend",
    () => {
      dialog.classList.remove("closing");
      dialog.close();
    },
    { once: true }
  );
});

dragElement(document.getElementById("main-dialog"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById("header")) {
    document.getElementById("header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

const dialog2 = document.getElementById("skills-dialog");

const closeBtn2 = document.getElementById("close-skills-button");

const gameDialog = document.getElementById("skills-dialog");
const playGameBtn = document.getElementById("dotgame");
const closeGameBtn = document.getElementById("close-skills-button");

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 520;

const BIRD_IMG = new Image();

const PIPE_TEXTS = ["HTML", "CSS", "Javascript"];

BIRD_IMG.src = `photos/circle2.png`;

let bird, pipes, score, frameCount, gameSpeed, gravity;
let animationFrameId;
let gameRunning = false;
let isAutoFlyActive = false;
let currentTextIndex;

function resetGame() {
  bird = {
    x: 150,
    y: canvas.height / 2,
    width: 50,
    height: 40,
    velocityY: 0,
  };
  pipes = [];
  score = 0;
  frameCount = 0;
  gameSpeed = 2;
  gravity = 0.3;
  isAutoFlyActive = false;
  currentTextIndex = 0;
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function update() {
  bird.velocityY += gravity;
  bird.y += bird.velocityY;

  if (isAutoFlyActive) {
    if (bird.y + bird.height >= canvas.height) {
      birdJump();
    } else {
      let nextTopPipe = null;
      let nextBottomPipe = null;

      for (let i = 0; i < pipes.length; i += 2) {
        if (pipes[i].x + pipes[i].width > bird.x) {
          nextTopPipe = pipes[i];
          nextBottomPipe = pipes[i + 1];
          break;
        }
      }
      if (nextBottomPipe) {
        const gapTop = nextTopPipe.y + nextTopPipe.height;
        const gapBottom = nextBottomPipe.y;
        const gapCenter = gapTop + (gapBottom - gapTop) / 2;
        if (bird.y + bird.height / 2 > gapCenter && bird.velocityY >= 0) {
          birdJump();
        }
      } else if (
        bird.y + bird.height / 2 > canvas.height / 2 + 15 &&
        bird.velocityY >= 0
      ) {
        birdJump();
      }
    }
  }

  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocityY = 0;
    if (!isAutoFlyActive) activateAutoFly();
  }
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocityY = 0;
    if (!isAutoFlyActive) activateAutoFly();
  }

  frameCount++;
  if (frameCount % 120 === 0) {
    const pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
    const pipeGap = 200;
    const serialText = PIPE_TEXTS[currentTextIndex];
    currentTextIndex = (currentTextIndex + 1) % PIPE_TEXTS.length;
    pipes.push({
      x: canvas.width,
      y: 0,
      width: 60,
      height: pipeHeight,
      passed: false,
      text: serialText,
    });
    pipes.push({
      x: canvas.width,
      y: pipeHeight + pipeGap,
      width: 60,
      height: canvas.height - pipeHeight - pipeGap,
      passed: true,
    });
  }

  pipes.forEach((pipe) => (pipe.x -= gameSpeed));
  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);

  if (!isAutoFlyActive) {
    checkCollisions();
  }
  checkScoring();
}

function draw() {
  ctx.fillStyle = "rgba(87, 84, 84, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8c8888ff";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(pipe.x, pipe.y, pipe.width, pipe.height);
  });

  ctx.fillStyle = "rgba(232, 227, 227, 0.7)";
  ctx.font = '26px "Special Elite", sans-serif, bold';
  ctx.textAlign = "center";
  pipes.forEach((pipe) => {
    if (pipe.text) {
      const pipeGap = 200;
      const textX = pipe.x + pipe.width / 2;
      const textY = pipe.y + pipe.height + pipeGap / 2;
      ctx.fillText(pipe.text, textX, textY);
    }
  });

  ctx.save();
  if (isAutoFlyActive) {
    ctx.globalAlpha = 0.6;
  }
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  let angle = (Math.PI / 6) * (bird.velocityY / 10);
  if (angle > Math.PI / 4) angle = Math.PI / 4;
  if (angle < -Math.PI / 4) angle = -Math.PI / 4;
  ctx.rotate(angle);
  ctx.drawImage(
    BIRD_IMG,
    -bird.width / 2,
    -bird.height / 2,
    bird.width,
    bird.height
  );
  ctx.restore();

  if (isAutoFlyActive) {
    ctx.fillStyle = "rgba(20, 19, 19, 0.8)";
    ctx.font = '20px "Special Elite", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("Auto-Fly activated", canvas.width / 2, canvas.height - 50);
  }
}

function checkCollisions() {
  for (const pipe of pipes) {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      bird.y < pipe.y + pipe.height &&
      bird.y + bird.height > pipe.y
    ) {
      activateAutoFly();
      return;
    }
  }
}

function checkScoring() {
  for (const pipe of pipes) {
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
      if (score > 0 && score % 5 === 0) gameSpeed += 0.2;
    }
  }
}

function birdJump() {
  if (gameRunning) {
    bird.velocityY = -7;
  }
}

function handleUserInput() {
  if (isAutoFlyActive) {
    isAutoFlyActive = false;
  }
  birdJump();
}

function startGame() {
  if (gameRunning) return;
  resetGame();
  gameRunning = true;
  gameLoop();
  canvas.focus();
}

function activateAutoFly() {
  isAutoFlyActive = true;
}

function stopGame() {
  if (!gameRunning) return;
  gameRunning = false;
  cancelAnimationFrame(animationFrameId);
}

playGameBtn.addEventListener("click", () => {
  gameDialog.showModal();
  startGame();
});

closeGameBtn.addEventListener("click", () => {
  stopGame();
  gameDialog.classList.add("closing");

  gameDialog.addEventListener(
    "animationend",
    () => {
      gameDialog.classList.remove("closing");
      gameDialog.close();
    },
    { once: true }
  );
});

canvas.addEventListener("mousedown", handleUserInput);
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  handleUserInput();
});
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameDialog.open) {
    e.preventDefault();
    handleUserInput();
  }
});

const optionsDialog = document.getElementById("options");

const openOptionsButton = document.getElementById("open-dialog-btn");
const openBtn2 = document.getElementById("Play");
const closeOptionsButton = document.getElementById("close-options-button");

openBtn2.addEventListener("click", () => {
  optionsDialog.showModal();
});

const closeOptionsBtn = document.getElementById("close-options-button");

closeOptionsBtn.addEventListener("click", () => {
  optionsDialog.classList.add("closing");

  optionsDialog.addEventListener(
    "animationend",
    () => {
      optionsDialog.classList.remove("closing");
      optionsDialog.close();
    },
    { once: true }
  );
});

const techStackDialog = document.getElementById("text-dialog");
const openTechStackButton = document.getElementById("dottxt");
const closeTechStackButton = document.getElementById("close-text-button");

openTechStackButton.addEventListener("click", () => {
  techStackDialog.showModal();
});

closeTechStackButton.addEventListener("click", () => {
  techStackDialog.classList.add("closing");

  techStackDialog.addEventListener(
    "animationend",
    () => {
      techStackDialog.classList.remove("closing");
      techStackDialog.close();
    },
    { once: true }
  );
});

const techStackDialog2 = document.getElementById("cert-dialog");
const openTechStackButton2 = document.getElementById("dotcert");
const closeTechStackButton2 = document.getElementById("close-cert-button");

openTechStackButton2.addEventListener("click", () => {
  techStackDialog2.showModal();
});

closeTechStackButton2.addEventListener("click", () => {
  techStackDialog2.classList.add("closing");

  techStackDialog2.addEventListener(
    "animationend",
    () => {
      techStackDialog2.classList.remove("closing");
      techStackDialog2.close();
    },
    { once: true }
  );
});

const portfolioRibbonImg = document.getElementById("rbbn");
const introPortfolioDialog = document.getElementById("FirstImpressionDialog");

if (introPortfolioDialog) {
  introPortfolioDialog.classList.add("first-load");

  introPortfolioDialog.addEventListener("animationend", function handler() {
    introPortfolioDialog.classList.remove("first-load");
    introPortfolioDialog.removeEventListener("animationend", handler);
  });
}

if (portfolioRibbonImg && introPortfolioDialog) {
  portfolioRibbonImg.addEventListener("click", () => {
    introPortfolioDialog.classList.add("closing");

    introPortfolioDialog.addEventListener("animationend", function handler() {
      introPortfolioDialog.close();
      introPortfolioDialog.classList.remove("closing");
      introPortfolioDialog.removeEventListener("animationend", handler);
    });
  });
}

document.addEventListener("mousemove", (e) => {
  const comet = document.createElement("div");
  comet.className = "comet";
  document.body.appendChild(comet);

  comet.style.left = e.pageX + "px";
  comet.style.top = e.pageY + "px";

  setTimeout(() => comet.remove(), 400);
});

const quotes = [
  "<how to center a div?>",
  "<error 404: failed to launch web>",
  "<messy code>",
  "<failed countless times>",
  "<brave don't give up>",
  "<copium + life support>",
  "<why is it not working?>",
  "<lost while debugging>",
  "<wow i don't recognise my own code>"
];

let index = 0;
const quoteText = document.getElementById("quote-text");

function changeQuote() {
  quoteText.classList.remove("drop-in");
  quoteText.classList.add("drop-out");

  setTimeout(() => {
    quoteText.textContent = quotes[index];
    quoteText.classList.remove("drop-out");
    quoteText.classList.add("drop-in");
    index = (index + 1) % quotes.length;
  }, 600);
}

quoteText.textContent = quotes[index];
quoteText.classList.add("drop-in");
index++;

setInterval(changeQuote, 3000);
