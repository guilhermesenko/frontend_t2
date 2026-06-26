import { backendAddress } from './constantes.js';
import { fetchAutenticado, getUsuario } from './auth.js';
import { montarNavegacao } from './nav.js';
import { Livro } from './catalogo.js';

montarNavegacao();
const anoEl = document.getElementById('ano-rodape');
if (anoEl) {
  anoEl.textContent = String(new Date().getFullYear());
}

const aviso = document.getElementById('aviso') as HTMLParagraphElement;
const areaForm = document.getElementById('area-form') as HTMLElement;
const lista = document.getElementById('lista-livros-admin') as HTMLUListElement;
const form = document.getElementById('form-livro') as HTMLFormElement;
const tituloForm = document.getElementById('titulo-form') as HTMLHeadingElement;
const inputId = document.getElementById('livro-id') as HTMLInputElement;
const inputTitulo = document.getElementById('titulo') as HTMLInputElement;
const inputAutor = document.getElementById('autor') as HTMLInputElement;
const inputGenero = document.getElementById('genero') as HTMLInputElement;
const inputAno = document.getElementById('ano') as HTMLInputElement;
const inputDescricao = document.getElementById('descricao') as HTMLTextAreaElement;
const botaoSalvar = document.getElementById('botao-salvar') as HTMLButtonElement;
const botaoCancelar = document.getElementById('botao-cancelar') as HTMLButtonElement;
const mensagem = document.getElementById('mensagem') as HTMLParagraphElement;

iniciar();

// Garante que só administradores usem a página.
async function iniciar(): Promise<void> {
  const usuario = await getUsuario();
  if (!usuario) {
    aviso.textContent = 'Faça login como administrador para acessar esta página.';
    return;
  }
  if (!usuario.is_staff) {
    aviso.textContent = 'Acesso restrito a administradores.';
    return;
  }
  areaForm.hidden = false;
  await carregarLivros();
  form.addEventListener('submit', salvar);
  botaoCancelar.addEventListener('click', limparForm);
}

async function carregarLivros(): Promise<void> {
  const resposta = await fetch(backendAddress + 'livros/');
  const livros: Livro[] = await resposta.json();
  lista.innerHTML = '';
  for (const livro of livros) {
    lista.appendChild(montarItem(livro));
  }
}

function montarItem(livro: Livro): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'livro';

  const titulo = document.createElement('strong');
  titulo.textContent = livro.titulo;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = `${livro.autor} - ${livro.genero} - ${livro.ano}`;

  const acoes = document.createElement('div');
  acoes.className = 'acoes-form';
  const editar = document.createElement('button');
  editar.textContent = 'Editar';
  editar.addEventListener('click', () => preencherForm(livro));
  const apagar = document.createElement('button');
  apagar.className = 'secundario';
  apagar.textContent = 'Remover';
  apagar.addEventListener('click', () => remover(livro.id));
  acoes.append(editar, apagar);

  item.append(titulo, meta, acoes);
  return item;
}

async function salvar(evento: Event): Promise<void> {
  evento.preventDefault();
  const corpo = {
    titulo: inputTitulo.value,
    autor: inputAutor.value,
    genero: inputGenero.value,
    ano: Number(inputAno.value),
    descricao: inputDescricao.value,
  };
  const id = inputId.value;
  const rota = id ? `livros/${id}/` : 'livros/';
  const metodo = id ? 'PUT' : 'POST';

  const resposta = await fetchAutenticado(rota, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });

  if (resposta.ok) {
    limparForm();
    await carregarLivros();
  } else {
    const erros = await resposta.json();
    mensagem.textContent = juntarErros(erros);
  }
}

function preencherForm(livro: Livro): void {
  inputId.value = String(livro.id);
  inputTitulo.value = livro.titulo;
  inputAutor.value = livro.autor;
  inputGenero.value = livro.genero;
  inputAno.value = String(livro.ano);
  inputDescricao.value = livro.descricao;
  tituloForm.textContent = 'Editar livro';
  botaoSalvar.textContent = 'Salvar';
  botaoCancelar.hidden = false;
  mensagem.textContent = '';
}

function limparForm(): void {
  inputId.value = '';
  form.reset();
  tituloForm.textContent = 'Cadastrar livro';
  botaoSalvar.textContent = 'Cadastrar';
  botaoCancelar.hidden = true;
  mensagem.textContent = '';
}

async function remover(id: number): Promise<void> {
  const resposta = await fetchAutenticado(`livros/${id}/`, { method: 'DELETE' });
  if (resposta.ok) {
    await carregarLivros();
  }
}

function juntarErros(erros: Record<string, string[] | string>): string {
  const partes: string[] = [];
  for (const valor of Object.values(erros)) {
    partes.push(Array.isArray(valor) ? valor.join(' ') : String(valor));
  }
  return partes.join(' ');
}
