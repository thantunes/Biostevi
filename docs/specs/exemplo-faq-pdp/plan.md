# Plano — FAQ na PDP (exemplo)

## Passos de implementação
1. **Configuração** — Reutilizar ou criar bloco em `store/blocks/faq/` e declarar no template PDP (`store/blocks/pdp/`).
2. **Estilo** — Ajustar/estender CSS em `styles/css/faq/` (ex.: `vtex.disclosure-layout.css`, `vtex.flex-layout.css`).
3. **Integração** — Incluir o bloco no `conditionalLayout` ou no `product.jsonc` na ordem desejada.
4. **Validação** — Testar em workspace (vtex link), acessibilidade (skill a11y) e SEO (skill seo-psi se aplicável).

## Arquivos impactados (exemplo)
- `store/blocks/pdp/product.jsonc` ou `conditionalLayout.json`
- `store/blocks/faq/*.jsonc`
- `styles/css/faq/*.css`

## Riscos / observações
- Garantir que o conteúdo do FAQ venha do CMS/Content; não hardcodar perguntas no bloco.
