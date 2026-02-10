---
name: vtex-native-docs
description: Lista e referencia documentação dos componentes nativos do VTEX IO/Store Framework. Use quando o usuário pedir lista de documentações de blocos VTEX, referência de componentes nativos, ou ao implementar blocos e precisar das docs oficiais.
---

# Documentações de Componentes Nativos VTEX

## Objetivo

Fornecer ao agente uma referência centralizada das documentações oficiais dos blocos e componentes nativos do VTEX IO (Store Framework), para consulta ao implementar ou configurar blocos.

## Quando usar

- Usuário pede "listar documentações de componentes nativos da VTEX", "onde achar doc do bloco X", "referência de blocos VTEX".
- Ao seguir a rule `create-element.mdc`: antes de montar blocos, consultar a documentação do bloco (ver `@vtex-components.mdc`).
- Ao implementar um novo bloco ou página: conferir props, `blocks`/`children` e interfaces na doc oficial.

## Como listar / consultar as documentações

1. **Context7 (MCP)**  
   Use os library IDs abaixo para buscar na documentação atualizada:
   - Store Framework (estrutura de blocos, interfaces): `/vtex-apps/store`
   - Store Components (componentes de loja): `/vtex-apps/store-components`
   - Header: `/vtex-apps/store-header`
   - Newsletter: `/vtex-apps/store-newsletter`
   - Portal VTEX (guias gerais): `/websites/developers_vtex`

2. **Documentação oficial**  
   Base URL: `https://developers.vtex.com/docs/guides/`  
   - Store Framework: `store-framework`  
   - Inspeção de blocos na loja: `how-to-interactively-inspect-blocks-on-a-store-framework-store` (parâmetro `?__inspect`)

3. **Lista detalhada**  
   Para a listagem completa de blocos, apps de origem e links, leia [reference.md](reference.md) neste skill.

## Resposta ao usuário

Quando o usuário pedir "listar todas as documentações de componentes nativos da VTEX":

1. Indicar que a lista está em `.cursor/skills/vtex-native-docs/reference.md`.
2. Resumir as fontes: Context7 (IDs acima), URL base developers.vtex.com e blocos mais usados no projeto (flex-layout, product-summary, search-bar, slider-layout, rich-text, etc.).
3. Para um bloco específico: usar Context7 com o library ID adequado ou abrir a doc no portal (ex.: SearchBar, Logo, InfoCard, ProductImages, SKUSelector em store-components).

## Integração com o projeto

- As rules `vtex-components.mdc` e `create-element.mdc` já orientam a usar documentação oficial ao criar blocos.
- Este skill centraliza **onde** estão essas documentações (Context7 + URLs + reference.md) para o agente listar e consultar sob demanda.
