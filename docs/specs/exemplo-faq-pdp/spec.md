# FAQ na PDP — Especificação (exemplo)

## O que construir (What)
Bloco de perguntas frequentes na página de produto (PDP), usando `vtex.disclosure-layout`, configurável pelo CMS.

## Por que (Why)
Reduzir dúvidas sobre uso, contraindicações e entrega diretamente na PDP; melhorar SEO com conteúdo estruturado.

## Escopo VTEX IO
- **Tipo:** Store block (flex + disclosure-layout) + estilo em `styles/css/faq/`
- **Onde:** `store/blocks/pdp/`, `store/blocks/faq/`, `styles/css/faq/`
- **Dependências:** `vtex.flex-layout`, `vtex.disclosure-layout`, `vtex.rich-text` (se necessário)

## Critérios de aceite (resumido)
1. Bloco aparece na PDP abaixo da descrição (ou posição definida no template).
2. Conteúdo editável pelo admin (Site Editor ou content source).
3. Acessível (teclado, ARIA) — validar com skill a11y.

## Referências
- Blocos existentes em `store/blocks/faq/`.
- `.cursor/skills/a11y-best-practices` para revisão.
