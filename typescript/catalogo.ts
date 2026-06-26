import { backendAddress } from './constantes.js';

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano: number;
  descricao: string;
  adicionado_por: string | null;
}

// Busca os livros na API e os exibe na lista da página.
export async function carregarCatalogo(): Promise<void> {
  const status = document.getElementById('status');
  const lista = document.getElementById('lista-livros');
  if (!lista) {
    return;
  }
  try {
    const resposta = await fetch(backendAddress + 'livros/');
    if (!resposta.ok) {
      throw new Error('Falha ao carregar');
    }
    const livros: Livro[] = await resposta.json();
    lista.innerHTML = '';
    if (livros.length === 0) {
      if (status) {
        status.textContent = 'Nenhum livro cadastrado ainda.';
      }
      return;
    }
    if (status) {
      status.textContent = '';
    }
    for (const livro of livros) {
      lista.appendChild(montarItem(livro));
    }
  } catch (erro) {
    if (status) {
      status.textContent = 'Não foi possível carregar o catálogo. Verifique se o backend está no ar.';
    }
  }
}

// Monta o elemento de lista de um livro (usando textContent para evitar injeção).
function montarItem(livro: Livro): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'livro';

  const titulo = document.createElement('strong');
  titulo.textContent = livro.titulo;

  const autor = document.createElement('span');
  autor.className = 'autor';
  autor.textContent = livro.autor;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = `${livro.genero} - ${livro.ano}`;

  const descricao = document.createElement('p');
  descricao.textContent = livro.descricao;

  item.append(titulo, autor, meta, descricao);
  return item;
}
