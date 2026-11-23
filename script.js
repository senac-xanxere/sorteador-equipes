const TOTAL_ALUNOS = 12;
const TOTAL_EQUIPES = 4;
const ALUNOS_POR_EQUIPE = 3;

const ALUNOS_EXEMPLO = [
  "Ana Silva",
  "Bruno Costa",
  "Carla Mendes",
  "Diego Rocha",
  "Eduarda Lima",
  "Felipe Alves",
  "Gabriela Souza",
  "Henrique Dias",
  "Isabela Martins",
  "João Pedro",
  "Larissa Nunes",
  "Mateus Oliveira",
];

const textareaAlunos = document.getElementById("lista-alunos");
const contadorEl = document.getElementById("contador");
const mensagemEl = document.getElementById("mensagem");
const secaoResultado = document.getElementById("secao-resultado");
const gridEquipes = document.getElementById("grid-equipes");
const inputsEquipes = document.querySelectorAll(".nome-equipe");

const btnSortear = document.getElementById("btn-sortear");
const btnExemplo = document.getElementById("btn-exemplo");
const btnLimpar = document.getElementById("btn-limpar");
const btnCopiar = document.getElementById("btn-copiar");

let ultimoResultado = [];

function obterAlunos() {
  return textareaAlunos.value
    .split("\n")
    .map((nome) => nome.trim())
    .filter((nome) => nome.length > 0);
}

function obterNomesEquipes() {
  return Array.from(inputsEquipes).map(
    (input, indice) => input.value.trim() || `Equipe ${indice + 1}`
  );
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function atualizarContador() {
  const quantidade = obterAlunos().length;
  contadorEl.textContent = `${quantidade} / ${TOTAL_ALUNOS} alunos`;
  contadorEl.classList.remove("valido", "excesso");

  if (quantidade === TOTAL_ALUNOS) {
    contadorEl.classList.add("valido");
  } else if (quantidade > TOTAL_ALUNOS) {
    contadorEl.classList.add("excesso");
  }

  mensagemEl.textContent = "";
}

function renderizarEquipes(equipes) {
  gridEquipes.innerHTML = "";

  equipes.forEach((equipe, indice) => {
    const card = document.createElement("article");
    card.className = `card-equipe cor-${indice + 1}`;
    card.style.animationDelay = `${indice * 60}ms`;

    const titulo = document.createElement("h3");
    titulo.textContent = equipe.nome;

    const lista = document.createElement("ul");
    equipe.integrantes.forEach((aluno) => {
      const item = document.createElement("li");
      item.textContent = aluno;
      lista.appendChild(item);
    });

    card.appendChild(titulo);
    card.appendChild(lista);
    gridEquipes.appendChild(card);
  });

  secaoResultado.classList.remove("oculto");
}

function sortearEquipes() {
  const alunos = obterAlunos();

  if (alunos.length !== TOTAL_ALUNOS) {
    const diferenca = TOTAL_ALUNOS - alunos.length;
    if (diferenca > 0) {
      mensagemEl.textContent = `Informe exatamente ${TOTAL_ALUNOS} alunos (faltam ${diferenca}).`;
    } else {
      mensagemEl.textContent = `Informe exatamente ${TOTAL_ALUNOS} alunos (há ${Math.abs(diferenca)} a mais).`;
    }
    return;
  }

  mensagemEl.textContent = "";

  const alunosEmbaralhados = embaralhar(alunos);
  const nomesEquipes = obterNomesEquipes();

  ultimoResultado = [];
  for (let i = 0; i < TOTAL_EQUIPES; i++) {
    const inicio = i * ALUNOS_POR_EQUIPE;
    ultimoResultado.push({
      nome: nomesEquipes[i],
      integrantes: alunosEmbaralhados.slice(inicio, inicio + ALUNOS_POR_EQUIPE),
    });
  }

  renderizarEquipes(ultimoResultado);
}

async function copiarResultado() {
  if (ultimoResultado.length === 0) return;

  const texto = ultimoResultado
    .map(
      (equipe) =>
        `${equipe.nome}:\n${equipe.integrantes.map((a) => `- ${a}`).join("\n")}`
    )
    .join("\n\n");

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
    } else {
      const auxiliar = document.createElement("textarea");
      auxiliar.value = texto;
      auxiliar.style.position = "fixed";
      auxiliar.style.opacity = "0";
      document.body.appendChild(auxiliar);
      auxiliar.select();
      document.execCommand("copy");
      document.body.removeChild(auxiliar);
    }

    const textoOriginal = btnCopiar.textContent;
    btnCopiar.textContent = "Copiado!";
    setTimeout(() => {
      btnCopiar.textContent = textoOriginal;
    }, 1800);
  } catch {
    mensagemEl.textContent = "Não foi possível copiar automaticamente.";
  }
}

textareaAlunos.addEventListener("input", atualizarContador);
btnSortear.addEventListener("click", sortearEquipes);

btnExemplo.addEventListener("click", () => {
  textareaAlunos.value = ALUNOS_EXEMPLO.join("\n");
  atualizarContador();
});

btnLimpar.addEventListener("click", () => {
  textareaAlunos.value = "";
  ultimoResultado = [];
  gridEquipes.innerHTML = "";
  secaoResultado.classList.add("oculto");
  atualizarContador();
  textareaAlunos.focus();
});

btnCopiar.addEventListener("click", copiarResultado);

atualizarContador();
