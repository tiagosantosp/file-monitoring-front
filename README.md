# 🖥️ File Monitoring - Frontend

Interface de usuário desenvolvida em Angular para visualização, upload e gerenciamento de arquivos processados pela API de File Monitoring.

---

## ✨ Features

- **Dashboard Interativo:** Visualização de estatísticas gerais e gráficos sobre os arquivos processados.
- **Lista de Arquivos Detalhada:** Tabela com todos os arquivos, status, paginação, ordenação e filtros.
- **Upload de Arquivos:** Interface para envio de novos arquivos `.txt` para processamento.
- **Gerenciamento de Arquivos:** Exclusão de arquivos com diálogo de confirmação.
- **Design Responsivo:** Interface adaptável utilizando Angular Material.

---

## 🏗️ Arquitetura e Estrutura

O projeto é uma aplicação de página única (SPA) construída com **Angular**, utilizando as melhores práticas e as features mais recentes do framework.

- **Standalone Components:** A aplicação utiliza componentes standalone, eliminando a necessidade de `NgModules` e simplificando a arquitetura.
- **Service Layer:** A comunicação com a API backend é abstraída em serviços (`ArquivosService`, `DashboardService`), centralizando a lógica de acesso a dados.
- **Programação Reativa:** Uso extensivo de RxJS para lidar com fluxos de dados assíncronos da API.
- **Componentização:** A UI é dividida em componentes reutilizáveis e focados em features específicas.

### Estrutura de Pastas (`src/app`)
```
app/
├── core/
│   ├── models/       # Modelos de DTOs (ex: ArquivoDto)
│   └── services/     # Serviços de comunicação com a API
│
├── features/
│   ├── dashboard/    # Componente do Dashboard
│   └── file-list/    # Componente da lista de arquivos
│
├── layout/
│   └── components/   # Componentes de layout (ex: MainLayout, Dialogs)
│
├── app.config.ts     # Configuração da aplicação
├── app.routes.ts     # Definição de rotas
└── app.ts            # Componente raiz
```

---

## 🛠️ Tecnologias

- **Angular 17+**
- **Angular CLI**
- **TypeScript**
- **Angular Material:** Para componentes de UI.
- **RxJS:** Para programação reativa.
- **Sass (SCSS):** Para estilização avançada.
- **Docker & Docker Compose:** Para containerização do ambiente de desenvolvimento.

---

## 🔌 Integração com a API

O frontend consome a **File Monitoring - Backend API**. A comunicação é gerenciada pelos seguintes serviços:

- **`ArquivosService`**: Responsável por interagir com os endpoints de `/api/arquivos`.
  - `apiArquivosGet()`: Lista todos os arquivos.
  - `apiArquivosUploadPost(file)`: Faz upload de um novo arquivo.
  - `apiArquivosIdDelete(id)`: Deleta um arquivo específico.

- **`DashboardService`**: Responsável por buscar os dados para o dashboard a partir dos endpoints `/api/dashboard`.
  - `apiDashboardEstatisticasGet()`: Obtém as estatísticas gerais.
  - `apiDashboardGraficoGet()`: Obtém os dados para o gráfico.

### Configuração da API
A URL base da API é configurada no arquivo `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000' // URL da API backend
};
```

---

## 🚀 Início Rápido (Desenvolvimento Local)

### Pré-requisitos
- Node.js (v20 ou superior)
- Angular CLI instalado globalmente (`npm install -g @angular/cli`)

### Passos
```bash
# 1. Clone o repositório
git clone <repository-url>
cd file-monitoring-front

# 2. Instale as dependências
npm install

# 3. Execute a aplicação
ng serve

# 4. Acesse no navegador
```
**URL:** http://localhost:4200/

---

## 🐳 Início Rápido (Docker)

Este método sobe um contêiner de desenvolvimento com **live-reloading** ativado.

### Pré-requisitos
- Docker Desktop instalado

### Passos
```bash
# 1. Na raiz do projeto, suba o serviço com Docker Compose
docker-compose up -d --build

# 2. Aguarde o build inicial
```
**URL:** http://localhost:4200/

Graças à configuração de volumes, qualquer alteração no código-fonte será refletida automaticamente no navegador.

### Comandos Docker Úteis
```bash
# Parar o contêiner
docker-compose down

# Ver logs do contêiner
docker logs file-monitoring-frontend -f

# Reconstruir a imagem e subir
docker-compose up -d --build
```

---


## 🚀 Melhorias Futuras

Esta é uma lista de sugestões para evoluir e aprimorar o projeto:

- **Autenticação e Autorização (JWT):**
  - Implementar uma tela de login.
  - Utilizar `Route Guards` para proteger rotas.
  - Criar um `HttpInterceptor` para anexar o token JWT em todas as requisições à API.

- **Atualizações em Tempo Real (WebSockets):**
  - Integrar com uma solução de WebSocket (como SignalR no backend) para que o dashboard e a lista de arquivos sejam atualizados automaticamente, sem a necessidade de recarregar a página.

- **Filtros Avançados e Paginação Server-Side:**
  - Adicionar filtros por intervalo de datas ou por adquirente na tela de arquivos.
  - Implementar paginação e ordenação server-side para otimizar a performance com grandes volumes de dados.

- **Internacionalização (i18n):**
  - Adicionar suporte a múltiplos idiomas (ex: Português e Inglês) utilizando a biblioteca `@ngx-translate/core`.

- **Theming e Dark Mode:**
  - Implementar um seletor de tema (claro/escuro) aproveitando os recursos de theming do Angular Material.

- **Visualização de Detalhes do Arquivo:**
  - Criar uma nova página ou um modal para exibir as transações de um arquivo específico, consumindo o endpoint `GET /api/arquivos/{id}`.

- **Testes End-to-End (E2E):**
  - Configurar um framework de testes E2E como o Cypress ou Playwright para automatizar e validar os fluxos de usuário mais importantes.

- **Pipeline de CI/CD:**
  - Criar um pipeline de integração e entrega contínua (usando GitHub Actions, por exemplo) para automatizar a execução dos testes, build e deploy da aplicação.

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto foi desenvolvido como um case técnico.