import { fetchAutenticado, exigirLogin } from './auth.js';
import { montarNavegacao } from './nav.js';

montarNavegacao();
const ano = document.getElementById('ano');
if (ano) {
  ano.textContent = String(new Date().getFullYear());
}

const form = document.getElementById('form-trocar') as HTMLFormElement | null;
const mensagem = document.getElementById('mensagem') as HTMLParagraphElement;

if (exigirLogin()) {
  form?.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const senhaAtual = (document.getElementById('senha-atual') as HTMLInputElement).value;
    const senhaNova = (document.getElementById('senha-nova') as HTMLInputElement).value;

    const resposta = await fetchAutenticado('contas/trocar-senha/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha_atual: senhaAtual, senha_nova: senhaNova }),
    });

    const dados = await resposta.json();
    if (resposta.ok) {
      mensagem.className = 'sucesso';
      mensagem.textContent = dados.detail || 'Senha alterada com sucesso.';
      form.reset();
    } else {
      mensagem.className = 'erro';
      mensagem.textContent = juntarErros(dados);
    }
  });
}

function juntarErros(erros: Record<string, string[] | string>): string {
  const partes: string[] = [];
  for (const valor of Object.values(erros)) {
    partes.push(Array.isArray(valor) ? valor.join(' ') : String(valor));
  }
  return partes.join(' ');
}
