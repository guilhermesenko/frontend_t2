import { backendAddress } from './constantes.js';
import { fetchAutenticado, exigirLogin } from './auth.js';
import { montarNavegacao } from './nav.js';
import { Livro } from './catalogo.js';

interface Leitura {
  id: number;
  livro: number;
  livro_detalhe: Livro;
  status: string;
  nota: number | null;
  resenha: string;
}

const ROTULO_STATUS: Record<string, string> = {
  quero_ler: 'Quero Ler',
  lendo: 'Lendo',
  li: 'Li',
};

montarNavegacao();
const anoEl = document.getElementById('ano');
if (anoEl) {
  anoEl.textContent = String(new Date().getFullYear());
}

const lista = document.getElementById('lista-leituras') as HTMLUListElement;
const statusLista = document.getElementById('status-lista');
const form = document.getElementById('form-leitura') as HTMLFormElement;
const tituloForm = document.getElementById('titulo-form') as HTMLHeadingElement;
const selectLivro = document.getElementById('livro') as HTMLSelectElement;
const selectStatus = document.getElementById('status') as HTMLSelectElement;
const inputNota = document.getElementById('nota') as HTMLInputElement;
const inputResenha = document.getElementById('resenha') as HTMLTextAreaElement;
const inputId = document.getElementById('leitura-id') as HTMLInputElement;
const botaoSalvar = document.getElementById('botao-salvar') as HTMLButtonElement;
const botaoCancelar = document.getElementById('botao-cancelar') as HTMLButtonElement;
const mensagem = document.getElementById('mensagem') as HTMLParagraphElement;

// Só usuários autenticados acessam esta página.
if (exigirLogin()) {
  iniciar();
}

async function iniciar(): Promise<void> {
  await carregarLivros();
  await carregarLeituras();
  form.addEventListener('submit', salvar);
  botaoCancelar.addEventListener('click', limparForm);
}

// Preenche o select de livros a partir do catálogo.
async function carregarLivros(): Promise<void> {
  const resposta = await fetch(backendAddress + 'livros/');
  const livros: Livro[] = await resposta.json();
  selectLivro.innerHTML = '';
  for (const livro of livros) {
    const opcao = document.createElement('option');
    opcao.value = String(livro.id);
    opcao.textContent = `${livro.titulo} (${livro.autor})`;
    selectLivro.appendChild(opcao);
  }
}

async function carregarLeituras(): Promise<void> {
  const resposta = await fetchAutenticado('leituras/');
  const leituras: Leitura[] = await resposta.json();
  lista.innerHTML = '';
  if (leituras.length === 0) {
    if (statusLista) {
      statusLista.textContent = 'Você ainda não adicionou nenhuma leitura.';
    }
    return;
  }
  if (statusLista) {
    statusLista.textContent = '';
  }
  for (const leitura of leituras) {
    lista.appendChild(montarItem(leitura));
  }
}

function montarItem(leitura: Leitura): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'livro';

  const titulo = document.createElement('strong');
  titulo.textContent = leitura.livro_detalhe.titulo;

  const meta = document.createElement('div');
  meta.className = 'meta';
  const nota = leitura.nota ? ` - nota ${leitura.nota}` : '';
  meta.textContent = `${ROTULO_STATUS[leitura.status] || leitura.status}${nota}`;

  const resenha = document.createElement('p');
  resenha.textContent = leitura.resenha;

  const acoes = document.createElement('div');
  acoes.className = 'acoes-form';
  const editar = document.createElement('button');
  editar.textContent = 'Editar';
  editar.addEventListener('click', () => preencherForm(leitura));
  const apagar = document.createElement('button');
  apagar.className = 'secundario';
  apagar.textContent = 'Remover';
  apagar.addEventListener('click', () => remover(leitura.id));
  acoes.append(editar, apagar);

  item.append(titulo, meta, resenha, acoes);
  return item;
}

// Envia o formulário: cria (POST) ou atualiza (PUT) conforme houver id.
async function salvar(evento: Event): Promise<void> {
  evento.preventDefault();
  const corpo = {
    livro: Number(selectLivro.value),
    status: selectStatus.value,
    nota: inputNota.value ? Number(inputNota.value) : null,
    resenha: inputResenha.value,
  };
  const id = inputId.value;
  const rota = id ? `leituras/${id}/` : 'leituras/';
  const metodo = id ? 'PUT' : 'POST';

  const resposta = await fetchAutenticado(rota, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });

  if (resposta.ok) {
    limparForm();
    await carregarLeituras();
  } else {
    const erros = await resposta.json();
    mensagem.textContent = juntarErros(erros);
  }
}

// Junta as mensagens de erro da API (cada campo pode ter lista de mensagens).
function juntarErros(erros: Record<string, string[] | string>): string {
  const partes: string[] = [];
  for (const valor of Object.values(erros)) {
    partes.push(Array.isArray(valor) ? valor.join(' ') : String(valor));
  }
  return partes.join(' ');
}

function preencherForm(leitura: Leitura): void {
  inputId.value = String(leitura.id);
  selectLivro.value = String(leitura.livro);
  selectStatus.value = leitura.status;
  inputNota.value = leitura.nota ? String(leitura.nota) : '';
  inputResenha.value = leitura.resenha;
  tituloForm.textContent = 'Editar leitura';
  botaoSalvar.textContent = 'Salvar';
  botaoCancelar.hidden = false;
  mensagem.textContent = '';
}

function limparForm(): void {
  inputId.value = '';
  form.reset();
  tituloForm.textContent = 'Adicionar leitura';
  botaoSalvar.textContent = 'Adicionar';
  botaoCancelar.hidden = true;
  mensagem.textContent = '';
}

async function remover(id: number): Promise<void> {
  const resposta = await fetchAutenticado(`leituras/${id}/`, { method: 'DELETE' });
  if (resposta.ok) {
    await carregarLeituras();
  }
}
