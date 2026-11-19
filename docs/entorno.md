# Entorno de práctica DevSecOps

## Sprint 0 local

Usa Node.js 24 y Git. En PowerShell, ejecuta estos comandos desde la raíz.

```powershell
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd audit --omit=dev --audit-level=high
npm.cmd run dev
```

Abre `http://localhost:3000`. La ruta `/api/health` devuelve `{"status":"ok"}` y comprueba que Next.js responde. Para usar Supabase desde una Server Action, copia `.env.example` a `.env.local` y completa la URL del proyecto y su clave publicable. El cliente de `src/lib/supabase/server.ts` está preparado para Server Actions y Route Handlers, donde Next.js permite escribir cookies. Añade el proxy de renovación de sesiones al implementar el inicio de sesión.

Supabase CLI y Vercel CLI están instaladas en el proyecto. En PowerShell, puedes invocarlas con `npx.cmd supabase --version` y `npx.cmd vercel --version`. Supabase CLI ya tiene su configuración en `supabase/config.toml`. Al definir el modelo del examen, usa `npx.cmd supabase migration new inicial` para crear el archivo de migración.

## GitHub, Supabase y Vercel

El flujo del examen es `hu/HU-XX` → PR a `develop` → PR a `main` en [PC2_PROYECTO_III](https://github.com/raul2505/PC2_PROYECTO_III). El workflow ejecuta CI y seguridad en ambos destinos. Los PR no reciben credenciales de despliegue. En `develop`, el destino de Vercel es Preview. En `main`, es Production.

Para enlazar las herramientas con tus cuentas desde PowerShell, abre una terminal nueva y completa los inicios de sesión en el navegador. Ejecuta `vercel link` después de crear o importar el proyecto en Vercel.

```powershell
gh auth login --hostname github.com --git-protocol https --scopes workflow
npx.cmd supabase login
npx.cmd supabase link --project-ref jdnfncwgrevcfdcdqsud
npx.cmd vercel login
npx.cmd vercel link
```

1. En Supabase, el proyecto de práctica tiene URL `https://jdnfncwgrevcfdcdqsud.supabase.co`. Copia su clave publicable desde el panel. Usa un segundo proyecto de Supabase si activas Preview. Guarda la contraseña de la base en un gestor de contraseñas.
2. En Vercel, configura un proyecto Next.js con Node.js 24. Añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en Preview y Production con los valores del Supabase correspondiente. El archivo `vercel.json` desactiva el despliegue automático por Git. Obtén el identificador de proyecto y de equipo o cuenta en los ajustes de Vercel.
3. En GitHub, crea los entornos `preview` y `production` en **Settings → Environments**, con las ramas `develop` y `main`, respectivamente. En cada entorno, registra los secretos correspondientes. Si tu plan no ofrece Environments, configura el destino a nivel de repositorio solo para un entorno y ajusta el workflow para operar únicamente en su rama.

   | Secreto | Valor |
   | --- | --- |
   | `VERCEL_TOKEN` | Token de acceso de Vercel |
   | `VERCEL_ORG_ID` | ID de cuenta o equipo de Vercel |
   | `VERCEL_PROJECT_ID` | ID de proyecto de Vercel |
   | `SUPABASE_ACCESS_TOKEN` | Token de acceso personal de Supabase |
   | `SUPABASE_PROJECT_ID` | Referencia del proyecto Supabase |
   | `SUPABASE_DB_PASSWORD` | Contraseña de la base Supabase |

4. Define `APP_URL` como variable de GitHub para producción, con el origen público estable de la app. Para habilitar la publicación, crea la variable **de repositorio** `DEPLOY_ENABLED` con valor `true`. Lanza **Pipeline DevSecOps → Run workflow** en `main` o espera al siguiente push. Para habilitar también `develop`, configura el entorno `preview` con su propio proyecto Supabase y crea la variable de repositorio `DEPLOY_PREVIEW_ENABLED` con valor `true`. El primer despliegue de la base omite las migraciones porque el modelo depende del enunciado.

## Jira y enunciado

Usa el [backlog de PPI](https://jauregui25erickr.atlassian.net/jira/software/projects/PPI/boards/35/backlog), donde están `Sprint 0`, `Sprint 1` y `Sprint 2`. Al recibir el enunciado, sigue [SKILL.md](../SKILL.md) para completar análisis, backlog CSV, diagramas, migraciones con RLS, historias por rama e informe. Usa enlaces reales y resultados verificados al documentar el examen.
