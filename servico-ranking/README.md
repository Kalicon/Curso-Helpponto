# Serviço do ranking · Curso Help Ponto

API preparada para Cloudflare Workers + D1. Permanecer no plano **Workers Free**; não habilitar plano pago. Os limites gratuitos são publicados em [Workers](https://developers.cloudflare.com/workers/platform/limits/) e [D1](https://developers.cloudflare.com/d1/platform/pricing/). Ao atingir limites do plano gratuito, o serviço pode recusar requisições até o restabelecimento das cotas.

## Ativação na conta do responsável

1. Criar uma conta Cloudflare gratuita. Nenhuma senha ou token deve ser colocado nos arquivos do site.
2. Nesta pasta executar `npm install` e `npx wrangler login` para autorizar a conta no navegador.
3. Criar o banco: `npx wrangler d1 create help-ponto-ranking`.
4. Colocar o ID retornado em `database_id` no arquivo `wrangler.jsonc`. O binding deve continuar como `DB`.
5. Executar `npx wrangler d1 migrations apply help-ponto-ranking --remote`.
6. Criar um segredo aleatório privado para a redução de abuso: `npx wrangler secret put RATE_SALT`. Informar uma cadeia aleatória longa, guardada apenas na conta Cloudflare. Não incluir esse valor no GitHub.
7. Executar `npx wrangler deploy` e anotar a URL HTTPS retornada.
8. Configurar essa URL como `apiUrl` em `site/assets/site-config.js`. Se estiver trabalhando na pasta original de desenvolvimento, preencher `publicacao/config.json` e gerar os entregáveis novamente.
9. Testar `/health`, concluir uma partida e conferir o ranking em outro navegador. Só depois executar o workflow manual de publicação no GitHub Pages.

O domínio autorizado é `https://kalicon.github.io`; o caminho do repositório não faz parte de uma origem HTTP. Se usar domínio próprio depois, atualizar `ALLOWED_ORIGINS` e republicar a API.

## O que o serviço faz

- Cria uma sessão por partida, válida por até 24 horas; a sessão só pode registrar um resultado.
- Recalcula os acertos e os pontos a partir das respostas e das 71 perguntas aprovadas.
- Rejeita perguntas de validação, respostas inexistentes, IDs duplicados na partida e placares incompatíveis.
- Mantém o envio idempotente: repetir a mesma partida com a mesma sessão não duplica os pontos.
- Limita a criação de sessões por origem de rede: até 30 por minuto. O IP é armazenado somente como hash com segredo e descartado junto com as sessões após 24 horas.
- Exibe o melhor resultado de cada nome normalizado. Os nomes iguais são agrupados.
- Retorna até 1.000 participantes; os indicadores mostram os totais do banco.

Este é um ranking educativo sem login, sem premiação e sem verificação de identidade. Não é um sistema antifraude: perguntas e alternativas ficam disponíveis no navegador, e um usuário técnico pode automatizar respostas. A quantidade de ajudas é informada pelo cliente. As respostas individuais não são armazenadas no banco do ranking, apenas o placar calculado, o nome/apelido, a data e o identificador de sessão.

## Testes e operação

Executar `npm test` com Node 22.17 ou superior. Os testes usam SQLite em memória para validar consultas e fluxo da API. A instalação e a ativação reais do Cloudflare ainda precisam ser concluídas na conta do responsável.

Os resultados não expiram automaticamente. Para remover um participante a pedido dele, o responsável pode executar uma consulta preparada pelo painel D1 usando o `player_key`, após conferir o nome. O site não oferece exclusão pública. Recomenda-se exportar os resultados ao final de cada turma e definir a retenção dos nomes com a unidade. O acesso aos resultados é público para quem acessa o site; não incluir dados sensíveis no nome.
