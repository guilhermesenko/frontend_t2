# Clube de Leitura - Frontend

Frontend do **Clube de Leitura**, trabalho 2 da disciplina INF1407 (Programação para
Web - PUC-Rio). É um site **estático** em HTML + CSS + **TypeScript** que consome a
API REST do backend (projeto separado) via `fetch`.

- Repositório do backend: https://github.com/guilhermesenko/backend_t2

## Estrutura

```
frontend_t2/
├── public/              # site estático (servido como está)
│   ├── index.html
│   ├── css/estilo.css
│   ├── img/
│   └── javascript/      # SAÍDA do compilador TypeScript (gerada, não versionada)
├── typescript/          # código-fonte TypeScript
│   ├── constantes.ts    # endereço da API (backendAddress)
│   ├── principal.ts
│   └── tsconfig.json
├── package.json
└── Dockerfile           # nginx servindo o public/
```

Todo o JavaScript é gerado a partir do TypeScript em `typescript/`, compilado para
`public/javascript/`.

## Pré-requisitos

- Node.js (para compilar o TypeScript)
- O backend rodando (veja o repositório do backend). O endereço da API é configurado
  em `typescript/constantes.ts` (`backendAddress`).

## Como rodar localmente

Instale as dependências e compile o TypeScript:

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

## Status

Em desenvolvimento. A página inicial e a configuração do projeto já estão prontas; o
consumo da API (catálogo, login JWT, lista de leituras e gerência de senha) será
implementado nas próximas etapas.
