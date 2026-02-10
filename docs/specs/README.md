# Specs e metodologia no repositório VTEX IO

**Arquitetura de contexto (Cursor/Claude):** esta pasta faz parte da **documentação** consultada pelo agente quando necessário. A documentação central do projeto (arquitetura, decisões de design, como o sistema funciona) está em **`AGENTS.MD`** na raiz. A implementação segue as **RULES** (`.cursor/rules/`) e usa **SKILLS** (`.cursor/skills/`) quando apropriado.

---

Este repositório pode seguir duas formas de aplicar **especificação e fluxo de trabalho** (inspiradas na comparação *BMAD vs Spec Driven*), adaptadas ao ecossistema VTEX IO (theme, store blocks, React, apps).

---

## 1. Abordagem leve — estilo **Spec Kit** (recomendada para o dia a dia)

**Ideia:** Foco no **o que construir** e **por quê**, com fluxo simples **Spec → Plan → Tasks → Code**, sem muitas personas nem configuração pesada.

### Como usar neste repo

1. **Para cada feature/block relevante** (novo bloco, alteração de PDP, novo template, app custom):
   - Copie a pasta `_template/` para uma pasta com o nome da feature, por exemplo:
     - `docs/specs/faq-pdp/`
     - `docs/specs/header-mobile/`
     - `docs/specs/slider-seo-v2/`
   - Preencha `spec.md` (o quê, por quê, escopo VTEX IO, critérios de aceite).
   - Preencha `plan.md` (passos de implementação e arquivos impactados).
   - Use `tasks.md` como checklist até a entrega.

2. **Fluxo de trabalho:**
   - **Spec** → define escopo e critérios (store block, React, app, estilo).
   - **Plan** → ordem de implementação e onde mexe no repo (`store/blocks/`, `react/`, `styles/`, `slider-layout-seo/`).
   - **Tasks** → checklist que leva ao código final.
   - **Code** → implementação seguindo as **RULES** em `.cursor/rules/` (ex.: `vtex-components.mdc`, `react-component.mdc`, `styles.mdc`); usar **SKILLS** quando a tarefa pedir (a11y, docs, QA, SEO, etc.).

3. **Setup mínimo:** só manter a pasta `docs/specs/` e o `_template/`. Não é obrigatório usar em toda alteração; use para mudanças que impactam várias partes (PDP, home, header, novo app).

**Vantagem no VTEX IO:** você documenta o “o quê” e “por quê” antes de criar blocos e componentes, evitando retrabalho e alinhando com as convenções já definidas nas rules.

---

## 2. Abordagem estruturada — estilo **BMAD**

**Ideia:** Estrutura mais rica: “agentes”/papéis, documentação por domínio e módulos reutilizáveis. No nosso contexto, **não precisamos de orquestração multiagente de verdade**; podemos interpretar assim:

- **Personas / fases** = tipos de trabalho no repo:
  - **Theme / Store** — blocos, templates, rotas (`store/blocks/`, `routes.json`).
  - **React / Apps** — componentes React e apps (ex.: `react/`, `slider-layout-seo/`).
  - **Estilo e a11y** — `styles/`, acessibilidade, SEO.
  - **Qualidade** — testes, revisão, deploy.

- **GEMs / módulos especializados** = alinhados à arquitetura de contexto:
  - **RULES** (`.cursor/rules/`) = “como” codar: VTEX components, React, estilos, assets (sempre presente ou sob demanda).
  - **SKILLS** (`.cursor/skills/`) = workflows especializados executados no contexto: a11y, component-docs, git-commit-push, prettier, qa-test-scenarios, refactor-cleanup, seo-psi.

Ou seja: **BMAD aqui = specs por domínio + uso consistente das rules e skills**. Não é necessário criar vários “agentes” separados; o Cursor já usa as rules/skills como “módulos” de comportamento.

### Como aplicar no repositório

1. **Documentação por domínio** (opcional):
   - Organize specs por área, por exemplo:
     - `docs/specs/store/` — blocos e páginas (home, PDP, header, footer, FAQ).
     - `docs/specs/apps/` — slider-layout-seo e futuros apps.
     - `docs/specs/experience/` — a11y, SEO, performance.
   - Em cada domínio use o mesmo fluxo Spec → Plan → Tasks (pode reusar o `_template/`).

2. **Consistência com .cursor:**
   - Ao implementar uma spec, invoque explicitamente as skills quando fizer sentido (ex.: “documentar este componente” → skill component-docs; “checar a11y” → a11y-best-practices; “commit” → git-commit-push).
   - As rules já definem padrões de blocos, React e estilos; o “agente” é o próprio fluxo de trabalho (spec → plan → tasks → code) + rules + skills.

3. **Maturidade:** à medida que o projeto crescer, você pode evoluir templates (ex.: spec com campos obrigatórios para PDP ou para apps) e manter um índice em `docs/specs/README.md` (lista de specs por domínio).

---

## Resumo prático

| Objetivo                         | Sugestão neste repo VTEX IO                                      |
|----------------------------------|-------------------------------------------------------------------|
| Setup rápido, foco em dev        | Use a **abordagem leve (Spec Kit)**: `_template/` + spec/plan/tasks por feature. |
| Organização por domínio + “agentes” | Use a **abordagem BMAD** como estrutura de pastas + rules/skills como “módulos”. |
| Manter qualidade                 | Sempre que possível, alinhe specs às **rules** e use **skills** (a11y, SEO, docs, QA). |

Para começar: crie uma pasta em `docs/specs/` para a próxima feature relevante, copie o `_template/`, preencha spec → plan → tasks e implemente seguindo **AGENTS.MD** + **RULES** e invocando **SKILLS** quando fizer sentido.

---

## Índice de specs (exemplos)

| Spec | Descrição |
|------|------------|
| `_template/` | Template base Spec → Plan → Tasks |
| `exemplo-faq-pdp/` | Exemplo: bloco de FAQ na PDP com disclosure-layout |
