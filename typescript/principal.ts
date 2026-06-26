import { carregarCatalogo } from './catalogo.js';
import { montarNavegacao } from './nav.js';

// Monta o menu conforme o estado de login.
montarNavegacao();

// Preenche o ano atual no rodapé.
const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

// Carrega o catálogo de livros da API.
carregarCatalogo();
