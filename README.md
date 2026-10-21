# Curso Help Ponto

Entregáveis finais para o repositório **Kalicon/Curso-Helpponto**.

## Endereços preparados

- HUB: https://kalicon.github.io/Curso-Helpponto/
- Jogo direto: https://kalicon.github.io/Curso-Helpponto/jogo.html
- Ranking: https://kalicon.github.io/Curso-Helpponto/ranking.html
- Repositório: https://github.com/Kalicon/Curso-Helpponto

Os endereços do site só funcionarão depois da ativação do GitHub Pages e da publicação. Os atalhos `.url` desta pasta já apontam para os endereços finais.

## Organização

- `site/`: únicos arquivos que devem ser publicados no GitHub Pages. HUB institucional, apresentação teórica, cartilha PDF, jogo e ranking.
- `servico-ranking/`: código e configuração do serviço de resultados. Não é publicado pelo GitHub Pages. Configuração detalhada em `servico-ranking/README.md`.
- `.github/workflows/pages.yml`: publicação manual, pelo botão Run workflow do GitHub Actions.
- `Site_GitHub_Pages.zip`: cópia da pasta pública, para entrega.

A versão pública não contém validação de perguntas, aula prática, modo Expedição, guia preliminar, referências internas, exportações de pareceres ou ferramentas de teste. O banco publicado contém apenas 71 perguntas revisadas.

## Antes de ativar

1. Concluir a ativação do serviço gratuito na conta Cloudflare, conforme o README do serviço.
2. Preencher `apiUrl` em `site/assets/site-config.js` com a URL HTTPS da API. Esse endereço é público e não é uma senha.
3. Na configuração do repositório, em Settings → Pages, escolher GitHub Actions como origem.
4. Executar o workflow **Publicar site** manualmente e conferir o endereço exibido pelo GitHub.
5. Testar uma partida com nome e conferir o ranking de outro computador.

Não publicar chaves privadas, `RATE_SALT`, `.env`, `.dev.vars`, banco SQLite ou tokens. Os arquivos públicos usam somente o endereço da API. O jogo é educativo e não possui premiação. O ranking é público e agrupa participantes com o mesmo nome; um apelido identificável pode ser utilizado.

## Identidade visual

HUB e ranking seguem a apresentação: azul `#0055A4`, branco, cinza e vermelho, com tipografia Roboto e scroll GSAP com profundidade moderada. As animações respeitam movimento reduzido. Somente o jogo mantém a identidade do palco, Leonor e bancada.
