const state = {
  view: {
    //alterações de visual
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
  },
  value: {
    //alterações de valor
    timerId: null,
    gameVelocity: 1000, // velocidade de spawn do inimigo
    hitPosition: 0,
    points: 0,
    currentTime: 60,
    life: 3,
    difficulty: 0,
  },

  actions: {
    //chamadas de funções
    countDownTimerId: setInterval(countDown, 1000),
  },
};

function countDown() {
  // modificando o timer
  state.value.currentTime--;
  state.view.timeLeft.textContent = state.value.currentTime;

  if (state.value.currentTime <= 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    alert("It's over! O seu resultado foi: " + state.value.points);
  }
}

function playAudio(audioname) {
  let audio = new Audio(`./src/audios/${audioname}.m4a`);
  audio.volume = 0.4;
  audio.play();
}

/* Gerar quadrado aleatório para o "inimigo" */
function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy"); //removendo o inimigo de todos os quadrados
  });

  let randomNumber = Math.floor(Math.random() * 9); // numero inteiro de 1 a 9
  let randomSquare = state.view.squares[randomNumber]; // pegando quadrado do numero aleatorio
  randomSquare.classList.add("enemy");
  state.value.hitPosition = randomSquare.id;
}

function moveEnemy() {
  // a cada  intervalo de tempo chama a função e assim move o inimigo constantemente

  state.value.timerId = setInterval(randomSquare, state.value.gameVelocity);
}

function addHitBoxListener() {
  /* para cada quadrado do painel a
     função verifica se é o "inimigo" */
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.value.hitPosition) {
        state.value.points++; // ao clicar se for o inimigo ele adciona 1 aos pontos
        state.view.score.textContent = state.value.points; // mostra pontuação
        state.value.hitPosition = null;
        playAudio("hit");

        // Caso clique no quadrado errado diminuir vidas
      } else if (
        (square.id !== state.value.hitPosition) &
        (state.value.life !== 0)
      ) {
        state.value.life--;
        state.view.lives.textContent = "x" + state.value.life;
      }

      difficulty(); // manipular dificuldade
      lives(); // verificar se as vidas acabaram/recuperar vidas
    });
  });
}

function lives() {
  if (state.value.life <= 0) {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.value.timerId);
    alert("It's over! O seu resultado foi: " + state.value.points);
  }

  if (state.value.points % 15 === 0) {
    state.value.life++;
    state.view.lives.textContent = "x" + state.value.life;
  }
}

function difficulty() {
  state.value.difficulty++; // Incrementar valor usado para aumento de spawn de inimigo
  if (state.value.difficulty % 5 === 0) {
    clearInterval(state.value.timerId);
    state.value.gameVelocity -= 60; //acelera o game
    state.value.timerId = setInterval(randomSquare, state.value.gameVelocity);
  }
  if (state.value.points % 10 === 0) {
    state.value.currentTime = state.value.currentTime + 7; //acrescimo de tempo
    state.view.timeLeft.textContent = state.value.currentTime;
  }
}

//função principal para chamar as outras funções iniciais
function init() {
  addHitBoxListener(); // "escuta" os click nas caixas
  moveEnemy();
}

init();
