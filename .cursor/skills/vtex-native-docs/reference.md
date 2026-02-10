# Referência: Documentações de Componentes Nativos VTEX

Listagem das fontes oficiais e dos blocos nativos do VTEX IO (Store Framework) para consulta ao implementar ou configurar blocos.

---

## 1. Fontes de documentação

### Context7 (MCP) – IDs de biblioteca

| Library ID | Conteúdo |
|------------|----------|
| `/vtex-apps/store` | Store Framework: estrutura de blocos, `blocks`/interfaces, `plugins.json`, identificadores |
| `/vtex-apps/store-components` | Componentes de loja: InfoCard, SearchBar, Logo, ProductImages, SKUSelector, CSS Handles, etc. |
| `/vtex-apps/store-header` | App de Header para lojas IO |
| `/vtex-apps/store-newsletter` | Componentes de newsletter |
| `/websites/developers_vtex` | Portal VTEX (guias gerais, APIs, Store Framework) |

### Documentação oficial (navegador)

| Recurso | URL |
|---------|-----|
| Store Framework | https://developers.vtex.com/docs/guides/store-framework |
| Boas-vindas VTEX IO | https://developers.vtex.com/docs/guides/welcome |
| Configuração de templates | https://developers.vtex.com/docs/guides/vtex-io-documentation-4-configuringtemplates |
| Interfaces | https://developers.vtex.com/docs/guides/vtex-io-documentation-interface |
| Inspeção de blocos na loja | https://developers.vtex.com/docs/guides/how-to-interactively-inspect-blocks-on-a-store-framework-store (usar `?__inspect` na URL da loja) |

### Repositórios de referência (estrutura e blocos)

- Store (BLOCKS.md, interfaces): https://github.com/vtex-apps/store
- Store Components (docs por componente): https://github.com/vtex-apps/store-components

---

## 2. Blocos nativos mais usados (Store Framework / Store Components)

Blocos que aparecem com frequência em templates e que possuem documentação no Context7 ou no GitHub.

### Layout e estrutura

| Bloco | App típica | Uso |
|-------|------------|-----|
| `flex-layout.row` | vtex.flex-layout | Linha (container horizontal) |
| `flex-layout.col` | vtex.flex-layout | Coluna (container vertical) |
| `stack-layout` | vtex.stack-layout | Empilhamento vertical |
| `sticky-layout` | vtex.sticky-layout | Conteúdo fixo ao rolar |
| `responsive-layout` | vtex.responsive-layout | Layout por breakpoint |
| `condition-layout` | vtex.condition-layout | Renderização condicional (Then/Else) |
| `disclosure-layout` | vtex.disclosure-layout | Conteúdo expansível (ex.: FAQ) |
| `modal-layout` | vtex.modal-layout | Modal |
| `slider-layout` | vtex.slider-layout | Carrossel/slider nativo |

### Header e navegação

| Bloco | App típica | Uso |
|-------|------------|-----|
| `header.full` / `header` | vtex.store-header | Header da loja |
| `search-bar` | vtex.store-components | Barra de busca |
| `logo` | vtex.store-components | Logo |
| `menu-link` | vtex.store-header | Links do menu |
| `category-menu` | vtex.store-header | Menu de categorias |
| `login` | vtex.login | Login |
| `minicart` | vtex.minicart | Minicart |

### Produto e PDP

| Bloco | App típica | Uso |
|-------|------------|-----|
| `product-summary.shelf` | vtex.product-summary | Card de produto na shelf |
| `product-summary-name` | vtex.product-summary | Nome do produto |
| `product-summary-image` | vtex.product-summary | Imagem do produto |
| `product-price` | vtex.product-price | Preço |
| `add-to-cart-button` | vtex.add-to-cart-button | Botão de compra |
| `product-identifier` | vtex.product-identifier | Identificador (ex.: SKU) |
| `product-specifications` | vtex.product-specifications | Especificações |
| `product-gifts` | vtex.product-gifts | Produtos brinde |
| `product-highlights` | vtex.product-highlights | Destaques |
| `reviews-and-ratings` | vtex.reviews-and-ratings | Avaliações |
| `wish-list` | vtex.wish-list | Lista de desejos |

### Busca e listagem

| Bloco | App típica | Uso |
|-------|------------|-----|
| `search-result-layout` | vtex.search-result | Layout da página de busca |
| `search-result-layout.customQuery` | vtex.search-result | Query customizada |
| `search-products-result` | vtex.search-result | Resultados de produtos |
| `orderby` | vtex.search-result | Ordenação |
| `filter-navigator` | vtex.search-result | Filtros |

### Conteúdo e mídia

| Bloco | App típica | Uso |
|-------|------------|-----|
| `rich-text` | vtex.rich-text | HTML/rich text |
| `info-card` | vtex.store-components | Card com imagem, título, CTA |
| `image` | vtex.store-components | Imagem |
| `store-link` | vtex.store-link | Link |
| `store-icons` | vtex.store-icons | Ícones |
| `carousel` | vtex.carousel | Carrossel de imagens |

### Footer e outros

| Bloco | App típica | Uso |
|-------|------------|-----|
| `footer` | vtex.store-footer | Rodapé |
| `newsletter` | vtex.store-newsletter | Newsletter |
| `telemarketing` | vtex.store-header | Telemarketing |
| `profile-form` | vtex.profile-form | Formulário de perfil |
| `order-placed` | vtex.order-placed | Página de pedido realizado |

---

## 3. Como consultar um bloco específico

1. **Context7**: usar `query-docs` com o library ID adequado (ex.: `/vtex-apps/store-components` para SearchBar, Logo, InfoCard, ProductImages, SKUSelector).
2. **Portal**: em https://developers.vtex.com/docs/guides/store-framework procurar pelo nome do bloco ou pelo app (ex.: store-components).
3. **Inspeção na loja**: abrir a página no navegador com `?__inspect` para ver app, bloco e classes CSS do que está renderizado.

---

## 4. Observações

- **CSS Handles**: muitos blocos têm documentação de CSS Handles no repositório store-components (ex.: ProductImages.md, SKUSelector.md, InfoCard.md).
- **Nome do bloco**: no JSONC usa-se `interface#label` (ex.: `flex-layout.row#minha-linha`). A interface define props e filhos permitidos.
- **Regras do projeto**: ao criar blocos, seguir `vtex-components.mdc` e `create-element.mdc`; para estilos, `styles.mdc` e documentação de CSS/Handles da VTEX.
