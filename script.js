// document.querySelector(‘algum tag ou classe do html do meu documento') > o console roda o arquivo e para e retorna o primeiro button que encontrar.
// Document.querySelectorAll(‘’) > quando quero selecionar várias tags ou classes de acordo com o filtro que apliquei.
// Quando é tag somente escrevo entre ‘ ‘, quando é classe ponho ‘.’, quando ID ‘#’ e data Atribut ‘[]’

// 🔎 querySelector → retorna o PRIMEIRO elemento que bater com o seletor (busca no DOM)
// 🔎 querySelectorAll → retorna TODOS (NodeList = lista de elementos, tipo array mas não é array puro)

const html = document.querySelector("html");
// html → representa o elemento raiz da página (onde você pode colocar atributos globais como data-contexto)

const focoBotao = document.querySelector(".app__card-button--foco");
// botão de modo foco (25 minutos)

const curtoBotao = document.querySelector(".app__card-button--curto");
// botão de descanso curto (5 minutos)

const longoBotao = document.querySelector(".app__card-button--longo");
// botão de descanso longo (15 minutos)

const banner = document.querySelector(".app__image");
// imagem principal que muda conforme contexto

const titulo = document.querySelector(".app__title");
// título principal que muda dinamicamente

const botoes = document.querySelectorAll(".app__card-button");
// NodeList com todos os botões → usado para remover "active" de todos

const iniciarOuPausarBt = document.querySelector("#start-pause");
// botão principal que muda entre "Começar" e "Pausar"

const musicaFocoInput = document.querySelector("#alternar-musica");
// checkbox que controla música (true/false)

const tempoNaTela = document.querySelector("#timer");
// elemento onde o tempo é exibido

//new audio serve para ler arquivos de musica

// Audio → API do navegador que cria um objeto de som controlável via JS
const musica = new Audio("sons/luna-rise-part-one.mp3");

musica.loop = true;
// loop → faz a música reiniciar automaticamente quando termina

const audioPlay = new Audio("/sons/play.wav");
// som ao iniciar

const audioPausa = new Audio("/sons/pause.mp3");
// som ao pausar

const audioTempoFinalizado = new Audio("./sons/beep.mp3");
// som ao terminar o tempo

//cronometro

const startPauseBotao = document.querySelector("#start-pause");
// mesmo botão armazenado novamente (poderia reutilizar a variável anterior)

let tempoDecorridoEmSegundos = 1500;
// estado do tempo (1500s = 25min)

let intervaloId = null;
// guarda o ID do setInterval → usado para parar depois

//.addEventListener: adicionar evento de clic > método .addEventListener e recebe 'click' como parameto. A arrow function diz o que vai acontecer quando se apertar o botão.

// addEventListener → registra um "ouvinte" de evento (fica esperando algo acontecer)

focoBotao.addEventListener("click", () => {
  tempoDecorridoEmSegundos = 1500;
  // redefine o tempo

  alterarContexto("foco");
  // muda UI e estado visual

  //classList: adcionna classes nesse contexto. Pega as classes que o query selector pegou em focoBotao e adiciona a elas o active.

  // classList → API para manipular classes CSS
  focoBotao.classList.add("active");
  // adiciona classe visual de ativo
});

curtoBotao.addEventListener("click", () => {
  tempoDecorridoEmSegundos = 300;
  alterarContexto("descanso-curto");
  curtoBotao.classList.add("active");
});

longoBotao.addEventListener("click", () => {
  tempoDecorridoEmSegundos = 900;
  alterarContexto("descanso-longo");
  longoBotao.classList.add("active");
});

//change é utilizado para trabalhar com input checkbox (true ou false)

// change → dispara quando o valor do input muda
musicaFocoInput.addEventListener("change", () => {
  // paused → propriedade booleana (true/false)
  if (musica.paused) {
    musica.play();
    // play() → inicia áudio
  } else {
    musica.pause();
    // pause() → pausa áudio
  }
});

function alterarContexto(contexto) {
  mostrarTempo();
  // atualiza o tempo na tela

  //passa por cada item que o querySelectorAll pegou e executa a funçao que ao passar por cada item unitariamente, o classList filta as classes do item e remove delas o 'active'

  // forEach → percorre lista (loop)
  botoes.forEach(function (botaoIdi) {
    botaoIdi.classList.remove("active");
    // remove estado ativo de todos
  });

  //variavel.setAttribute('parametro 1: qual elemento voce quer alterar?, 'parametro 2 o que eu quero atribuir quando eu tiver o focoBotao acionado?)

  // setAttribute → altera atributos HTML (inclusive data-*)
  html.setAttribute("data-contexto", contexto);

  banner.setAttribute("src", `/imagens/${contexto}.png`);
  // template string → permite usar ${variável}

  // switch → estrutura de decisão baseada em valor
  switch (contexto) {
    case "foco":
      //O innerHTML é uma propriedade do JavaScript que permite acessar ou substituir todo o conteúdo que está dentro de uma tag HTML

      // innerHTML → permite inserir HTML (inclusive tags)
      titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;
      break;

    case "descanso-curto":
      titulo.innerHTML = `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
      break;

    case "descanso-longo":
      titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
      break;

    default:
      break;
  }
}

//3

// função executada a cada segundo
const contagemRegressiva = () => {
  if (tempoDecorridoEmSegundos <= 0) {
    audioTempoFinalizado.play(); // áudio executado quando cronômetro finalizar

    alert("Tempo finalizado!");

    const focoAtivo = html.getAttribute("data-contexto") == "foco";
    // getAttribute → lê valor de atributo

    if (focoAtivo) {
      // CustomEvent → evento criado para comunicação entre arquivos diferentes
      const evento = new CustomEvent("focoFinalizado");

      // dispatchEvent → dispara evento
      document.dispatchEvent(evento);
    }

    zerar();
    return;
  }

  tempoDecorridoEmSegundos--;
  // decrementa 1 segundo

  mostrarTempo();
};

//1

startPauseBotao.addEventListener("click", iniciarOuPausar);

//2

function iniciarOuPausar() {
  if (intervaloId) {
    audioPausa.play(); // áudio executado quando cronômetro for pausado

    zerar();
    return;
  }

  audioPlay.play(); // áudio executado quando cronômetro iniciar

  // setInterval → executa função repetidamente
  intervaloId = setInterval(contagemRegressiva, 1000);

  //.textContent - altera o texto elemento html

  iniciarOuPausarBt.innerHTML =
    '<img class="app__card-primary-butto-icon" src="/imagens/pause.png" alt=""><span>Pausar</span>';
}

//4

function zerar() {
  // clearInterval → para execução repetida
  clearInterval(intervaloId);

  intervaloId = null;

  iniciarOuPausarBt.innerHTML =
    ' <img class="app__card-primary-butto-icon" src="/imagens/play_arrow.png" alt=""><span>Começar</span>';
}

function mostrarTempo() {
  // Date → usado aqui para formatar tempo
  const tempo = new Date(tempoDecorridoEmSegundos * 1000);

  // toLocaleTimeString → formata para mm:ss
  const tempoFormatado = tempo.toLocaleTimeString("pt-Br", {
    minute: "2-digit",
    second: "2-digit",
  });

  tempoNaTela.innerHTML = `${tempoFormatado}`;
}

// inicializa tela com tempo correto
mostrarTempo();
