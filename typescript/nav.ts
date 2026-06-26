import { estaLogado, logout, getUsuario } from './auth.js';

// Monta os links do menu conforme o usuário esteja logado e seu papel.
export async function montarNavegacao(): Promise<void> {
  const nav = document.getElementById('navegacao');
  if (!nav) {
    return;
  }
  nav.innerHTML = '';
  nav.appendChild(criarLink('index.html', 'Catálogo'));

  if (estaLogado()) {
    nav.appendChild(criarLink('minhasLeituras.html', 'Minhas leituras'));
    nav.appendChild(criarLink('trocarSenha.html', 'Trocar senha'));

    // Link exclusivo de administrador (depende do whoami).
    const usuario = await getUsuario();
    if (usuario && usuario.is_staff) {
      nav.appendChild(criarLink('adminLivros.html', 'Gerenciar livros'));
    }

    const sair = criarLink('#', 'Sair');
    sair.addEventListener('click', (evento) => {
      evento.preventDefault();
      logout();
      window.location.href = 'index.html';
    });
    nav.appendChild(sair);
  } else {
    nav.appendChild(criarLink('login.html', 'Entrar'));
    nav.appendChild(criarLink('registrar.html', 'Cadastrar'));
  }
}

function criarLink(href: string, texto: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = texto;
  return link;
}
