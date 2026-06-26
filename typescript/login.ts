import { login } from './auth.js';
import { montarNavegacao } from './nav.js';

montarNavegacao();

const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

const form = document.getElementById('form-login') as HTMLFormElement | null;
const erro = document.getElementById('erro');

form?.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const usuario = (document.getElementById('username') as HTMLInputElement).value;
  const senha = (document.getElementById('password') as HTMLInputElement).value;
  const ok = await login(usuario, senha);
  if (ok) {
    window.location.href = 'index.html';
  } else if (erro) {
    erro.textContent = 'Usuário ou senha inválidos.';
  }
});
