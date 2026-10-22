# Curso Help Ponto

Capacitação para consulta e prática sobre frequência no Help Ponto, com apresentação, cartilha e um jogo de perguntas com Leonor e ranking compartilhado.

## Acesse

| Material | Link |
| --- | --- |
| HUB do curso | [Abrir o curso](https://kalicon.github.io/Curso-Helpponto/) |
| Jogo | [Entrar no palco](https://kalicon.github.io/Curso-Helpponto/jogo.html) |
| Ranking | [Ver os resultados](https://kalicon.github.io/Curso-Helpponto/ranking.html) |
| Cartilha | [Baixar o PDF dos slides](https://kalicon.github.io/Curso-Helpponto/materiais/Cartilha_Help_Ponto.pdf) |

O site está publicado no GitHub Pages. Não é necessário instalar o jogo. Os atalhos `.url` deste repositório também abrem os endereços online.

## O que você encontra

- **Apresentação:** conteúdo de frequência e uma tela de aula prática antes do encerramento.
- **Cartilha dos slides:** PDF para baixar e consultar.
- **Jogo:** partidas de dez perguntas, sorteadas entre 71 questões revisadas, com alternativas embaralhadas e progressão até um milhão de pontos.
- **Ajudas:** eliminar alternativas, consultar Leonor, pular uma pergunta e ouvir a bancada de Marcelo, Lia e Kalil. Os palpites da bancada podem estar errados.
- **Leonor e palco:** falas variadas, narração, trilha de suspense e cenas especiais na pergunta final e na conquista do milhão.
- **Ranking online:** envio automático do resultado, melhores desempenhos por nome e destaque para quem chega ao milhão.

O jogo é educativo. Os pontos não correspondem a dinheiro ou premiação.

## Partidas e resultados

Informe seu nome antes de começar. O ranking é público; você pode usar um apelido que permita sua identificação pelo grupo. Participantes com o mesmo nome são agrupados, portanto prefira um nome que evite confusão.

Uma partida interrompida pode ser retomada neste navegador por até 24 horas, preservando a pergunta e as ajudas usadas. Em computadores compartilhados, confira o nome antes de continuar.

Resultados com envio pendente ficam guardados no navegador, que tenta reenviar ao reconectar, reabrir o jogo ou acionar o botão de reenvio. O identificador da partida evita duplicação. Limpar os dados do navegador remove partidas e envios guardados. A abertura do site e o ranking compartilhado dependem de conexão com a internet.

A narração utiliza as vozes disponíveis no navegador e no dispositivo. A disponibilidade e a qualidade da voz feminina podem variar entre computadores e celulares. Som e música dependem da interação inicial do participante.

## Identidade visual e acessibilidade

HUB e ranking seguem o padrão da apresentação: azul `#0055A4`, branco, cinza, vermelho e tipografia Roboto. O scroll usa GSAP com efeitos de profundidade. Somente o jogo possui a identidade própria do palco.

As animações respeitam a preferência por movimento reduzido. Foram realizadas verificações em Chrome e em tamanhos de tela de celular; isso não representa uma certificação em todos os navegadores e dispositivos.

## Organização

| Caminho | Conteúdo |
| --- | --- |
| `site/` | Arquivos públicos do HUB, apresentação, PDF, jogo e ranking |
| `servico-ranking/` | API de resultados em Cloudflare Workers e banco D1 |
| `.github/workflows/pages.yml` | Publicação manual no GitHub Pages |
| `Site_GitHub_Pages.zip` | Pacote dos arquivos públicos para entrega |

Somente a pasta `site/` é enviada ao GitHub Pages. O serviço de ranking possui implantação própria; consulte [sua documentação](servico-ranking/README.md).

As ferramentas de validação de perguntas, os pareceres, documentos internos e o guia prático ainda em validação ficam fora da entrega pública. As ilustrações do guia em preparação usam dados fictícios; capturas com dados pessoais não devem ser publicadas.

## Manutenção e publicação

Este repositório contém os entregáveis gerados. No ambiente de desenvolvimento, as alterações devem ser feitas nos arquivos de origem e processadas pelo gerador `publicacao/gerar-entregaveis.py`, evitando que uma geração posterior sobrescreva ajustes feitos diretamente em `site/`.

Para publicar uma nova versão do site:

1. Gerar e conferir os entregáveis, os links e o conteúdo das perguntas.
2. Enviar as alterações para a branch `main`.
3. No GitHub, abrir **Actions → Publicar site → Run workflow**.
4. Aguardar a conclusão e conferir o HUB, o jogo e o ranking online.

O workflow é manual: enviar um commit não publica automaticamente o site. Alterações apenas neste README não exigem uma nova publicação no Pages.

Os testes do serviço de ranking podem ser executados em `servico-ranking/` com `npm ci` e `npm test`, usando uma versão recente do Node.js com suporte a `node:sqlite`.

Nunca incluir tokens, `RATE_SALT`, `.env`, `.dev.vars`, bancos locais ou credenciais nos commits. Os arquivos públicos usam somente o endereço da API. O ranking tem finalidade educativa e não oferece verificação de identidade dos participantes.
