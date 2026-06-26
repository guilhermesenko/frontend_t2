import { backendAddress } from './constantes.js';

const CHAVE_ACCESS = 'clube_access';
const CHAVE_REFRESH = 'clube_refresh';

export function getAccess(): string | null {
  return localStorage.getItem(CHAVE_ACCESS);
}

export function estaLogado(): boolean {
  return getAccess() !== null;
}

export function logout(): void {
  localStorage.removeItem(CHAVE_ACCESS);
  localStorage.removeItem(CHAVE_REFRESH);
}

// Faz login na API e guarda os tokens JWT no localStorage.
export async function login(usuario: string, senha: string): Promise<boolean> {
  const resposta = await fetch(backendAddress + 'api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usuario, password: senha }),
  });
  if (!resposta.ok) {
    return false;
  }
  const dados = await resposta.json();
  localStorage.setItem(CHAVE_ACCESS, dados.access);
  localStorage.setItem(CHAVE_REFRESH, dados.refresh);
  return true;
}

// fetch que injeta o token de acesso no cabeçalho Authorization.
export function fetchAutenticado(rota: string, opcoes: RequestInit = {}): Promise<Response> {
  const headers = new Headers(opcoes.headers || {});
  const access = getAccess();
  if (access) {
    headers.set('Authorization', 'Bearer ' + access);
  }
  return fetch(backendAddress + rota, { ...opcoes, headers });
}

export interface Usuario {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

// Busca os dados do usuário logado (ou null se não estiver autenticado).
export async function getUsuario(): Promise<Usuario | null> {
  if (!estaLogado()) {
    return null;
  }
  try {
    const resposta = await fetchAutenticado('contas/whoami/');
    if (!resposta.ok) {
      return null;
    }
    return await resposta.json();
  } catch (erro) {
    return null;
  }
}

// Redireciona para a tela de login caso o usuário não esteja autenticado.
export function exigirLogin(): boolean {
  if (!estaLogado()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
