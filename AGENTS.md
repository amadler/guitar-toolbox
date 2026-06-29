# AGENTS

Purpose: Help AI coding agents be productive quickly in this Angular monorepo (app + library).

## Project Map

- App: [src/app/app.component.ts](src/app/app.component.ts)
- App bootstrap/config: [src/main.ts](src/main.ts), [src/app/app.config.ts](src/app/app.config.ts)
- Library root: [projects/guitar-toolbox-lib/src/public-api.ts](projects/guitar-toolbox-lib/src/public-api.ts)
- Main library form component: [projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.ts](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.ts)
- Command pattern classes: [projects/guitar-toolbox-lib/src/lib/shared/UICommands.ts](projects/guitar-toolbox-lib/src/lib/shared/UICommands.ts)
- Music API wrapper: [projects/guitar-toolbox-lib/src/lib/api.service.ts](projects/guitar-toolbox-lib/src/lib/api.service.ts)
- Workspace config: [angular.json](angular.json), [package.json](package.json)

For baseline Angular commands, see [README.md](README.md) and [projects/guitar-toolbox-lib/README.md](projects/guitar-toolbox-lib/README.md).

## Build And Test Commands

Run from repository root.

- Start app dev server: npm start
- Build app: npm run build
- Run app tests: npm test
- Build library specifically: ng build guitar-toolbox-lib
- Run library tests specifically: ng test guitar-toolbox-lib


## Backlog Management
- Backlog entries live in `BACKLOG.md` at project root.
- Every backlog item MUST follow this template exactly, with all 6 sections present and non-empty:
  ```
  # Title

  ## Motivation

  ## Solution

  ## MVP

  ## Done when

  ## Status
  ```
- Before adding/modifying a backlog item, derive a validation checklist from the template (e.g., `- [ ] Każdy wpis ma wszystkie sekcje: Title, Motivation, Solution, MVP, Done when, Status`).
- After writing/updating `BACKLOG.md`, verify every section exists exactly once per item.
- Valid Status values: `OPEN`, `FIXED`, `POSTPONED`, `WON'T DO`.
- Always give a file location with line number for each backlog item.

## Documentation Consistency Validation
When updating or reviewing `.md` documentation files, derive a validation checklist from the following template and verify every item:

```
Documentation consistency — checklist template:
- [ ] Nazwy serwisów (FretboardOrchestrationService, FretboardStateService, itd.) są takie same we wszystkich .md
- [ ] apiUrl (http://localhost:3000) jest spójny we wszystkich plikach
- [ ] BACKLOG.md statusy są zgodne z resztą dokumentów
- [ ] Ścieżki do plików (src/app/...) faktycznie istnieją w repozytorium
- [ ] Endpointy backend API (GET /api/chords/:name/:root) są spójne
- [ ] AI Chat oznaczony jako POSTPONED wszędzie gdzie występuje
- [ ] Żaden .md nie zawiera starych/nieaktualnych nazw serwisów (np. MusicTheoryFacadeService, ScaleAndTriadService)
```

## Architecture Boundaries

- The app in src/ consumes the published library API from guitar-toolbox-lib.
- The library should avoid direct dependencies on app-local services.
- Command execution in [projects/guitar-toolbox-lib/src/lib/shared/UICommands.ts](projects/guitar-toolbox-lib/src/lib/shared/UICommands.ts) is intentional and supports dual execution paths (local UI and external orchestration).
- Keep command contracts interface-based so a consumer app can provide its own NoteSelectionService implementation.

## Conventions To Preserve

- Angular standalone components are used (no NgModule-centric patterns).
- SCSS is the expected style format.
- Keep changes minimal and localized; avoid broad refactors unless requested.
- Prefer extending library public exports in [projects/guitar-toolbox-lib/src/public-api.ts](projects/guitar-toolbox-lib/src/public-api.ts) when functionality must be consumable by app code.

## Known Pitfalls

- In library code, do not import app-only service paths such as ../services/... that exist only in consumers.
- [projects/guitar-toolbox-lib/src/lib/api.service.ts](projects/guitar-toolbox-lib/src/lib/api.service.ts) currently hardcodes localhost:3000; treat this as environment-sensitive.
- There is known test drift risk between emitted form payload shape and legacy spec expectations in toolbox form tests.
- The guitar-neck-shared dependency is CommonJS and can trigger Angular optimization warnings.

## Editing Guidance For Agents

- If a user asks for fixes, prefer editing library sources over node_modules outputs.
- After edits, run targeted error checks first, then relevant tests.
- If touching command classes, verify no hard dependency on consumer-only Angular DI services is introduced.
- If adding exports, update [projects/guitar-toolbox-lib/src/public-api.ts](projects/guitar-toolbox-lib/src/public-api.ts).

## Git workflow
- **Never commit directly to `master`** — always create a feature/fix branch first.
- Branch naming: `fix/<short-description>` for bug fixes, `feat/<short-description>` for new features.
- After committing on the branch, ask the user for merge approval before merging to `master`.
- Squash-merge is preferred to keep history clean.
