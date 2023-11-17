const state = {
  view: {
    //alterações de visual
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
  },
  value: {
    //alterações de valor
    timerId: null,
    gameVelocity: 1000,
    hitPosition: 0,
    points: 0,
    currentTime: 60,
  },

  actions: {
    //chamadas de funções
    timerId: setInterval(randomSquare, 1000), // a cada  intervalo de tempo chama a função e assim move o inimigo constantemente
    countDownTimerId: setInterval(countDown, 1000), // decrementar tempo, começando de 1 minuto
  },
};
// o objeto acima torna as variaveis bastante semanticas

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
  let audio = new Audio(`../src/audios/${audioname}.m4a`);
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

function addHitBoxListener() {
  /* para cada quadrado do painel a
     função verifica se é o "inimigo" */
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.value.hitPosition) {
        state.value.points++; // ao clicar se for o inimigo ele adciona 1 aos pontos
        state.view.score.textContent = state.value.points; // mostra pontuação
        state.value.hitPosition =
          null; /* hitposition nulo para nao haver farm de pontos
        enquanto o intervalo de moveEnemy nao passa */

        playAudio("hit");
      }
    });
  });
}

//função principal para chamar as outras funções iniciais
function init() {
  addHitBoxListener(); // "escuta" os click nas caixas
}

init();
