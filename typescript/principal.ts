import { backendAddress } from './constantes.js';

// Preenche o ano atual no rodapé.
const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

// Placeholder do catálogo. O consumo da API (GET /livros/) será implementado
// na próxima etapa, usando fetch para o backendAddress.
const status = document.getElementById('status');
if (status) {
  status.textContent = `Em breve: catálogo carregado de ${backendAddress}`;
}
