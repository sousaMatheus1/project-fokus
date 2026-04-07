const AdicionarTarefaBt = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const botaoCancelar = document.querySelector(
  ".app__form-footer__button--cancel",
);
const paragrafoDescricaoTarefa = document.querySelector(
  ".app__section-active-task-description",
);
const BtRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const BtRemoverTodas = document.querySelector("#btn-remover-todas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// /////////////////////////////////////////////////////////////////////////////////////////////
function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// /////////////////////////////////////////////////////////////////////////////////////////////
function limparFormulario() {
  textArea.value = "";
  formAdicionarTarefa.classList.add("hidden");
}

// /////////////////////////////////////////////////////////////////////////////////////////////
function criarElementoTarefa(cadaTarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;
  const paragrafo = document.createElement("p");
  paragrafo.classList.add("app__section-task-list-item-description");
  paragrafo.textContent = cadaTarefa.descrição;

  const botao = document.createElement("button");
  botao.classList.add("app_button-edit");
  botao.addEventListener("click", () => {
    const novaDescricao = prompt("Qual é a nova tarefa?");

    if (novaDescricao) {
      paragrafo.textContent = novaDescricao;
      cadaTarefa.descrição = novaDescricao;
      atualizarTarefas();
    }
  });

  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "/imagens/edit.png");

  botao.append(imagemBotao);
  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if (cadaTarefa.completa) {
    console.log("COMPLETA:", cadaTarefa);
    li.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", "disabled");
  } else {
    li.addEventListener("click", () => {
      if (cadaTarefa.completa) return;
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((elemento) => {
          elemento.classList.remove("app__section-task-list-item-active");
        });

      if (tarefaSelecionada == cadaTarefa) {
        paragrafoDescricaoTarefa.textContent = "";
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return;
      }

      tarefaSelecionada = cadaTarefa;
      liTarefaSelecionada = li;
      paragrafoDescricaoTarefa.textContent = cadaTarefa.descrição;
      li.classList.add("app__section-task-list-item-active");
    });
  }

  return li;
}

// /////////////////////////////////////////////////////////////////////////////////////////////
AdicionarTarefaBt.addEventListener("click", () => {
  formAdicionarTarefa.classList.toggle("hidden");
});

// /////////////////////////////////////////////////////////////////////////////////////////////
formAdicionarTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const cadaTarefa = {
    descrição: textArea.value,
  };

  tarefas.push(cadaTarefa);
  const elementoTarefa = criarElementoTarefa(cadaTarefa);
  ulTarefas.append(elementoTarefa);
  atualizarTarefas();
  limparFormulario();
});

// /////////////////////////////////////////////////////////////////////////////////////////////
botaoCancelar.addEventListener("click", limparFormulario);

/////////////////////////////////////////////////////////////////////////////////////////////
tarefas.forEach((cadaTarefa) => {
  const elementoTarefa = criarElementoTarefa(cadaTarefa);

  ulTarefas.append(elementoTarefa);
});

// /////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("focoFinalizado", () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");

    liTarefaSelecionada.classList.add("app__section-task-list-item-complete");

    liTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "disabled");

    tarefaSelecionada.completa = true;

    atualizarTarefas();
  }
});

const removerTarefas = (somenteCompletas) => {
  const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
  
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });

  tarefas = somenteCompletas ? tarefas.filter((tarefa) => !tarefa.completa) : []
  atualizarTarefas();
};
 
BtRemoverConcluidas.addEventListener ('click', () => removerTarefas(true))
BtRemoverTodas.addEventListener ('click', () => removerTarefas(false))