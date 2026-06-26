import { backendAddress } from './constantes.js';
import { montarNavegacao } from './nav.js';

montarNavegacao();

const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

const form = document.getElementById('form-registro') as HTMLFormElement | null;
const mensagem = document.getElementById('mensagem');

form?.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const usuario = (document.getElementById('username') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const senha = (document.getElementById('password') as HTMLInputElement).value;

  const resposta = await fetch(backendAddress + 'contas/registrar/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usuario, email: email, password: senha }),
  });

  if (resposta.ok) {
    if (mensagem) {
      mensagem.className = 'sucesso';
      mensagem.textContent = 'Conta criada! Redirecionando para o login...';
    }
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
  } else {
    const erros = await resposta.json();
    if (mensagem) {
      mensagem.className = 'erro';
      mensagem.textContent = formatarErros(erros);
    }
  }
});

// Junta as mensagens de erro retornadas pela API em um texto único.
function formatarErros(erros: Record<string, string[] | string>): string {
  const partes: string[] = [];
  for (const campo of Object.keys(erros)) {
    const valor = erros[campo];
    partes.push(Array.isArray(valor) ? valor.join(' ') : String(valor));
  }
  return partes.join(' ');
}
