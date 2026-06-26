# Clube de Leitura - Frontend

Frontend do **Clube de Leitura**, trabalho 2 da disciplina INF1407 (Programação para
Web - PUC-Rio). É um site **estático** em HTML + CSS + **TypeScript** que consome a
API REST do backend (projeto separado) via `fetch`.

- Repositório do backend: https://github.com/guilhermesenko/backend_t2

## Funcionalidades

- Catálogo de livros (público), carregado da API.
- Cadastro e login de usuário (JWT guardado no `localStorage`).
- Minhas leituras: o usuário adiciona, edita e remove suas próprias leituras
  (status, nota e resenha), com a regra de só dar nota depois de ler.
- Área de administrador (apenas `is_staff`): cadastro, edição e remoção de livros.
- Troca de senha e redefinição de senha por token.
- Menu de navegação que muda conforme o usuário esteja deslogado, logado ou seja admin.

## Estrutura

```
frontend_t2/
├── public/              # site estático (servido como está)
│   ├── index.html       # catálogo
│   ├── login.html / registrar.html
│   ├── minhasLeituras.html
│   ├── adminLivros.html
│   ├── trocarSenha.html / recuperarSenha.html
│   ├── css/estilo.css
│   ├── img/
│   └── javascript/      # SAÍDA do compilador TypeScript (gerada, não versionada)
├── typescript/          # código-fonte TypeScript
│   ├── constantes.ts    # endereço da API (backendAddress)
│   ├── auth.ts          # login, logout, tokens, fetch autenticado
│   ├── nav.ts           # menu por papel
│   ├── catalogo.ts / leituras.ts / adminLivros.ts
│   ├── login.ts / registro.ts / trocarSenha.ts / recuperarSenha.ts
│   └── tsconfig.json
├── package.json
└── Dockerfile           # nginx servindo o public/
```

Todo o JavaScript é gerado a partir do TypeScript em `typescript/`, compilado para
`public/javascript/`.

## Pré-requisitos

- Node.js (para compilar o TypeScript).
- O backend rodando (veja o repositório do backend). O endereço da API é configurado
  em `typescript/constantes.ts` (`backendAddress`).

## Como rodar localmente

```bash
npm install
npm run build        # compila uma vez
# ou
npm run watch        # recompila a cada alteração
```

Sirva a pasta `public/`:

```bash
cd public
python3 -m http.server 8080
```

Acesse `http://localhost:8080`.

## Rodando com Docker

O `Dockerfile` faz um build em duas etapas: compila o TypeScript e serve os arquivos
estáticos com nginx.

```bash
docker build -t clubeleitura_frontend_t2 .
docker run -p 8080:80 clubeleitura_frontend_t2
```

Acesse `http://localhost:8080`.
