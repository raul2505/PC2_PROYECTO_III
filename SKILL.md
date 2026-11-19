---
name: devsecops-express
description: Guía en una sola skill para resolver un caso práctico DevSecOps con Next.js + Supabase + Vercel - análisis, backlog para Jira (épicas, HU, sprints, CSV), diagramas, modelo de datos con RLS, implementación por HU y pipeline de GitHub Actions con seguridad. Usar cuando el usuario pegue el caso o pida "empezar el examen", "backlog", "diagramas", "pipeline" o "informe".
---

# DevSecOps Express

Trabaja por pasos y **muestra el resultado de cada paso antes de seguir**. Todo lo escrito va en `docs/`.
Si el enunciado pide algo distinto a esta guía, manda el enunciado.

## Paso 1 · Análisis → `docs/analisis.md`
- Resumen del problema en 3 líneas.
- Actores y roles (máximo 3-4 roles reales del caso).
- Requisitos funcionales `RF-01..` con prioridad MoSCoW.
- Requisitos no funcionales: seguridad, disponibilidad, rendimiento.
- Supuestos (lo que el caso no dice y tú decides).

## Paso 2 · Backlog Jira → `docs/backlog.md` + `docs/jira.csv`
- Épicas `EP-01..`: tabla ID | Épica | Descripción | Objetivo | Sprint. Incluye siempre una épica **DevSecOps**.
- HU `HU-01..`: "Como <rol> quiero <acción> para <beneficio>". Cada una con 2-3 criterios Gherkin
  (Dado/Cuando/Entonces), y al menos uno de seguridad (rol no autorizado → acceso denegado).
- Story points en Fibonacci (1, 2, 3, 5, 8). Explica brevemente la estimación (Planning Poker).
- Sprints: Sprint 0 = setup (repo, pipeline, Supabase, Vercel), Sprint 1 = núcleo, Sprint 2 = resto.
- Definition of Done: pruebas y pipeline en verde, sin hallazgos críticos, desplegado, criterios cumplidos.
- CSV (UTF-8, comas, comillas dobles), columnas:
  `Issue Id,Issue Type,Summary,Description,Parent,Priority,Story Points,Sprint`
  Épicas con `Epic` y sin Parent; HU con `Story` y Parent = Issue Id de su épica.
  Importar en Jira: Configuración → Importación externa → CSV. Crea los sprints antes con el mismo nombre.

## Paso 3 · Diagramas → `docs/diagramas.md` (bloques mermaid)
Haz solo los que pida el caso. Si no dice nada, haz estos 4:
1. **Casos de uso**: `flowchart LR`, actores fuera y un `subgraph` con los CU (uno por RF).
2. **Arquitectura lógica**: Navegador → Next.js (páginas + Server Actions) → Supabase (Auth, Postgres con RLS).
3. **Arquitectura física**: Usuario → Vercel (CDN + Functions) → Supabase (AWS), con GitHub Actions como CI/CD.
4. **Entidad-relación**: `erDiagram` en 3FN, igual a las tablas de la migración.

## Paso 4 · Modelo de datos → `supabase/migrations/<fecha>_inicial.sql`
- Tabla `perfiles (id → auth.users, rol con CHECK)` más las tablas del caso.
- `enable row level security` en TODAS las tablas, y políticas por rol.
- GRANT explícito a `authenticated`, solo de lo necesario (la Data API puede no darlos automáticamente).
- Nunca le des permisos de escritura a `anon`.

## Paso 5 · Implementación (una HU por rama)
- Rama `hu/HU-XX` → PR a `develop` → `main`. Commits con el formato `HU-XX: descripción`.
- Cada Server Action valida la entrada con **zod** y comprueba el rol en el servidor antes de tocar la BD.
- La clave `service_role` solo se usa en el servidor; jamás en componentes cliente ni en `NEXT_PUBLIC_*`.
- Al menos 1 prueba (Vitest) por HU: el caso feliz y el de rol no autorizado.
- No leas ni imprimas `.env.local`. Los secretos van en Vercel y en GitHub Secrets.

## Paso 6 · Pipeline → `.github/workflows/pipeline.yml`
Un solo workflow con jobs encadenados (`needs`). Usa esta base y ajústala:

```yaml
name: Pipeline DevSecOps
on:
  push: { branches: [develop, main] }
  pull_request: { branches: [develop, main] }
permissions: { contents: read }
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npx vitest run
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder
  seguridad:
    needs: ci
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - name: Secretos (Gitleaks)
        run: |
          curl -sSL https://github.com/gitleaks/gitleaks/releases/download/v8.24.3/gitleaks_8.24.3_linux_x64.tar.gz | tar xz
          ./gitleaks git --redact --verbose .
      - name: Dependencias (npm audit)
        run: npm audit --omit=dev --audit-level=high
  deploy:
    needs: seguridad
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - name: Migraciones Supabase
        run: |
          npx supabase link --project-ref "${{ secrets.SUPABASE_PROJECT_ID }}" --password "${{ secrets.SUPABASE_DB_PASSWORD }}"
          npx supabase db push --remote --yes --password "${{ secrets.SUPABASE_DB_PASSWORD }}"
      - name: Deploy Vercel
        run: |
          npm i -g vercel
          ENV=$([ "${{ github.ref_name }}" = main ] && echo production || echo preview)
          PROD=$([ "$ENV" = production ] && echo --prod || echo "")
          vercel pull --yes --environment=$ENV --token=${{ secrets.VERCEL_TOKEN }}
          vercel build $PROD --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt $PROD --token=${{ secrets.VERCEL_TOKEN }}
      - name: Smoke
        if: github.ref_name == 'main'
        run: curl -fsS "${{ vars.APP_URL }}" > /dev/null
```

Secretos de GitHub: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID`,
`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Variable (no secreta): `APP_URL` = dominio `https://<proyecto>.vercel.app`.
Errores típicos:
- La URL de Supabase es `https://<ref>.supabase.co`, **sin** `/rest/v1/`.
- `gh` necesita el permiso workflow: `gh auth refresh -s workflow`.
- Pon `"git": {"deploymentEnabled": false}` en `vercel.json` para evitar un doble deploy.
- Smoke contra el dominio público, no contra la URL única del deploy (esa está protegida).

## Paso 7 · Informe → `docs/informe.md`
Secciones:
1. DevOps: las 8 fases, qué se hizo en cada una y un control de seguridad por fase.
2. Diagramas con su explicación.
3. Scrum: backlog, épicas, estimación, sprints, ceremonias, DoD y criterios.
4. Implementación: ER en 3FN, por qué relacional, capturas del MVP, ramas, commits y pipeline en verde.

Pon el link del deploy y del repo al inicio. Marca con `[CAPTURA]` lo que falte.
No inventes links ni resultados: usa solo los reales (`gh run list`, la URL de Vercel).
