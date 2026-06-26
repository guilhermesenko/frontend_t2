import { backendAddress } from './constantes.js';
import { montarNavegacao } from './nav.js';

montarNavegacao();
const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

const formSolicitar = document.getElementById('form-solicitar') as HTMLFormElement;
const msgSolicitar = document.getElementById('msg-solicitar') as HTMLParagraphElement;
const formConfirmar = document.getElementById('form-confirmar') as HTMLFormElement;
const msgConfirmar = document.getElementById('msg-confirmar') as HTMLParagraphElement;

// Solicita o envio do token de redefinição.
formSolicitar.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const resposta = await fetch(backendAddress + 'contas/recuperar-senha/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email }),
  });
  const dados = await resposta.json();
  msgSolicitar.className = resposta.ok ? 'sucesso' : 'erro';
  msgSolicitar.textContent = dados.detail || juntarErros(dados);
});

// Confirma a redefinição com uid, token e nova senha.
formConfirmar.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const uid = (document.getElementById('uid') as HTMLInputElement).value;
  const token = (document.getElementById('token') as HTMLInputElement).value;
  const senhaNova = (document.getElementById('senha-nova') as HTMLInputElement).value;
  const resposta = await fetch(backendAddress + 'contas/recuperar-senha/', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: uid, token: token, senha_nova: senhaNova }),
  });
  const dados = await resposta.json();
  if (resposta.ok) {
    msgConfirmar.className = 'sucesso';
    msgConfirmar.textContent = (dados.detail || 'Senha redefinida.') + ' Você já pode entrar.';
    formConfirmar.reset();
  } else {
    msgConfirmar.className = 'erro';
    msgConfirmar.textContent = juntarErros(dados);
  }
});

function juntarErros(erros: Record<string, string[] | string>): string {
  const partes: string[] = [];
  for (const valor of Object.values(erros)) {
    partes.push(Array.isArray(valor) ? valor.join(' ') : String(valor));
  }
  return partes.join(' ');
}
