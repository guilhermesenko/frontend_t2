import { carregarCatalogo } from './catalogo.js';

// Preenche o ano atual no rodapé.
const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

// Carrega o catálogo de livros da API.
carregarCatalogo();
