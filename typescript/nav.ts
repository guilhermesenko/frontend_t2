import { estaLogado, logout } from './auth.js';

// Monta os links do menu conforme o usuário esteja logado ou não.
export function montarNavegacao(): void {
  const nav = document.getElementById('navegacao');
  if (!nav) {
    return;
  }
  nav.innerHTML = '';
  nav.appendChild(criarLink('index.html', 'Catálogo'));

  if (estaLogado()) {
    const sair = criarLink('#', 'Sair');
    sair.addEventListener('click', (evento) => {
      evento.preventDefault();
      logout();
      window.location.href = 'index.html';
    });
    nav.appendChild(sair);
  } else {
    nav.appendChild(criarLink('login.html', 'Entrar'));
  }
}

function criarLink(href: string, texto: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = texto;
  return link;
}
