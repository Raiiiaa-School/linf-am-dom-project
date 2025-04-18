# Git Commands

Visão geral de comandos essenciais do Git para uso na linha de comando (CLI), amplamente utilizados para controle de versão em projetos de desenvolvimento.

## git init

Inicializa um novo repositório Git em um diretório local. Cria a estrutura básica do Git (como a pasta `.git`) para começar a rastrear alterações no projeto.

1. Exemplo: `git init`.
2. Usado no início de um projeto ou para converter um diretório existente em repositório.
3. Não conecta automaticamente a repositórios remotos.

## git clone

Copia um repositório Git existente (geralmente remoto) para o ambiente local, incluindo todo o histórico e arquivos.

1. Exemplo: `git clone https://github.com/usuario/repo.git`.
2. Cria um diretório com o nome do repositório e configura o remoto automaticamente.
3. Usado para baixar projetos de plataformas como GitHub ou GitLab.

## git add

Adiciona alterações de arquivos ao _staging area_, preparando-as para o próximo _commit_. Pode incluir arquivos específicos ou todos modificados.

1. Exemplo: `git add arquivo.txt` ou `git add .` (todos os arquivos).
2. Essencial para selecionar quais mudanças serão salvas no histórico.
3. Não grava as alterações no repositório, apenas as marca.

## git commit

Salva as alterações do _staging area_ no repositório local, criando um ponto no histórico com uma mensagem descritiva.

1. Exemplo: `git commit -m "Adiciona nova funcionalidade"`.
2. A opção `-m` permite adicionar a mensagem diretamente; sem ela, abre um editor.
3. Usado para registrar versões do projeto de forma organizada.

## git push

Envia os _commits_ do repositório local para um repositório remoto, atualizando-o com as alterações.

1. Exemplo: `git push origin main`.
2. Requer um remoto configurado (ex.: `origin`) e o nome do branch (ex.: `main`).
3. Usado para compartilhar trabalho ou fazer backup em servidores como GitHub.

## git pull

Atualiza o repositório local com as alterações mais recentes de um repositório remoto, combinando _fetch_ e _merge_.

1. Exemplo: `git pull origin main`.
2. Útil para sincronizar o trabalho em equipe.
3. Pode gerar conflitos se houver alterações locais incompatíveis.

## git status

Exibe o estado atual do repositório, mostrando arquivos modificados, no _staging_ ou não rastreados.

1. Exemplo: `git status`.
2. Ajuda a verificar o que será incluído no próximo _commit_.
3. Essencial para manter controle sobre o progresso do trabalho.  
   Aqui está o arquivo Markdown com comandos adicionais do Git, incluindo `git merge` e outros mais específicos, porém necessários, seguindo a estrutura solicitada:

## git branch

Gerencia branches (ramificações) no repositório, permitindo listar, criar ou deletar linhas paralelas de desenvolvimento.

1. Exemplo: `git branch` (lista branches), `git branch nome` (cria branch).
2. Útil para trabalhar em features ou correções sem afetar o branch principal.
3. Use `git branch -d nome` para deletar um branch local.

## git merge

Integra as alterações de um branch em outro, combinando seus históricos.

1. Exemplo: `git merge feature` (mescla o branch `feature` no atual).
2. Pode gerar conflitos se houver alterações concorrentes; exige resolução manual.
3. Usado para consolidar trabalho de branches em um único fluxo (ex.: `main`).

## git log

Exibe o histórico de _commits_ do repositório, incluindo detalhes como autor, data e mensagem.

1. Exemplo: `git log` ou `git log --oneline` (formato compacto).
2. Ajuda a rastrear mudanças e identificar pontos específicos no projeto.
3. Personalizável com opções como `--graph` para visualizar branches.

## git checkout

Alterna entre branches ou restaura arquivos para um estado específico do histórico.

1. Exemplo: `git checkout nome-branch` ou `git checkout hash arquivo.txt`.
2. Substituído em parte por `git switch` e `git restore` em versões recentes.
3. Usado para navegar no projeto ou recuperar versões antigas de arquivos.

## git rebase

Reorganiza o histórico de _commits_, aplicando alterações de um branch sobre outro de forma linear.

1. Exemplo: `git rebase main` (reaplica o branch atual sobre `main`).
2. Alternativa ao _merge_, cria um histórico mais limpo, mas reescreve commits.
3. Cuidado: não use em branches compartilhados para evitar conflitos em equipe.

## git stash

Salva alterações locais temporariamente, limpando o diretório de trabalho sem fazer _commit_.

1. Exemplo: `git stash` (guarda alterações), `git stash pop` (recupera).
2. Útil para alternar tarefas sem perder trabalho em progresso.
3. Pode armazenar múltiplos _stashes_ (use `git stash list` para ver).

## git reset

Reverte o repositório ou _staging_ para um estado anterior, podendo descartar _commits_ ou alterações.

1. Exemplo: `git reset --hard HEAD^` (remove o último _commit_ e alterações).
2. Opções: `--soft` (mantém alterações), `--hard` (descarta tudo).
3. Usado para corrigir erros ou desfazer _commits_ locais.

## Observações

1. Esses comandos ampliam o controle sobre branches, histórico e alterações.
2. Exigem cuidado em repositórios compartilhados (ex.: `rebase`, `reset`).
3. Combinados com comandos básicos, formam um fluxo robusto de versionamento.
4. Esses comandos formam a base para o uso diário do Git na CLI.
5. Combinados, permitem gerir versões localmente e em equipe.
6. Outros comandos como `git branch`, `git merge` e `git log` expandem o controle avançado.
