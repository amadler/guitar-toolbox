# Guitar Toolbox — Architecture Overview

## Table of Contents

- [Monorepo Layout](#monorepo-layout)
- [Component Tree](#component-tree)
- [Data Flow](#data-flow)
- [Theming Strategy](#theming-strategy)

---

## Monorepo Layout

```
guitar-toolbox/                     ← Angular workspace root
├── src/                            ← Demo application (library consumer)
│   ├── main.ts                     ← App bootstrap
│   ├── app/
│   │   ├── app.component.ts        ← Single-component demo app
│   │   ├── app.config.ts           ← provides HttpClient, routing
│   │   └── app.routes.ts           ← (empty — no routing needed)
│   └── styles.scss                 ← Global styles
├── projects/
│   └── guitar-toolbox-lib/         ← Reusable Angular library
│       ├── src/lib/
│       │   ├── toolbox-forms/       ← FormsWrapperComponent, ScaleOrChordComponent, CustomPatternComponent, ToolboxBuilderComponent
│       │   ├── shared/             ← interval-utils.ts, model/
│       │   ├── api.service.ts      ← HTTP wrapper (DEPRECATED — no backend)
│       │   └── api-config.token.ts ← API_BASE_URL InjectionToken (DEPRECATED)
│       ├── public-api.ts           ← Public API surface (barrel)
│       └── package.json            ← npm package metadata
├── angular.json                    ← Workspace config
├── package.json                    ← Dependencies
├── BACKLOG.md                      ← Feature/fix backlog
└── AGENTS.md                       ← AI agent development guidelines
```

---

## Component Tree

```
AppComponent (demo app)
└── lib-forms-wrapper [FormsWrapperComponent]
    └── lib-toolbox-builder [ToolboxBuilderComponent]
        ├── (Show mode — scale-or-chord)
        │   ├── Type selector (Scale | Chord)
        │   ├── Pattern selector (dynamic based on type)
        │   ├── Key selector (C, C#, D, ...)
        │   └── Submit button
        ├── (Compare mode — scale-chord)
        │   ├── Scale: type + key selectors
        │   ├── Chord: type + key selectors
        │   └── Submit button
        └── (Build mode — custom pattern)
            ├── Intervals input (comma-separated numbers)
            ├── Root note selector
            └── Submit button
```

The three modes are mutually exclusive — toggled by tab buttons in `ToolboxBuilderComponent`.

---

## Data Flow

### Communication with Host App

The library communicates with the host app (GNUI) through a single `@Output()` event:

```typescript
// FormsWrapperComponent
@Output() toolboxEv: EventEmitter<FretboardCommand> = new EventEmitter<FretboardCommand>();
```

### FretboardCommand types

```typescript
type FretboardCommand =
  | { kind: 'scale'; key: string; scaleType: string }
  | { kind: 'chord'; key: string; chordType: string }
  | { kind: 'intervalPattern'; key: string; intervals: number[] }
  | { kind: 'scaleChordRelation'; scaleKey: string; scaleType: string; chordKey: string; chordType: string };
```

### Show Mode (scale-or-chord)

```
User selects Type → valueChanges triggers availablePatterns update
User selects Pattern + Key
User clicks "Show" → submitForm()
  └─ emits FretboardCommand { kind: 'scale'|'chord', key, scaleType|chordType }
```

### Compare Mode (scale-chord)

```
User selects Scale (type + key) + Chord (type + key)
User clicks button → emits FretboardCommand { kind: 'scaleChordRelation', scaleKey, scaleType, chordKey, chordType }
```

### Build Mode (custom pattern)

```
User enters intervals (e.g. "1,3,5")
User selects root note
User clicks button → intervalsToNoteNames() converts to note names
  └─ emits FretboardCommand { kind: 'intervalPattern', key, intervals }
```

### Consumer Integration

The host app binds to `(toolboxEv)` and dispatches to its services:

```html
<lib-forms-wrapper (toolboxEv)="onToolboxEvent($event)"></lib-forms-wrapper>
```

---

## Theming Strategy

### Separation of concerns

| Category | Who defines | Examples |
|----------|------------|---------|
| **Layout & geometry** | Library (hardcoded fallbacks) | `height: 40px`, `gap: var(--toolbox-gap, 18px)`, `grid-template-columns: 1fr 1fr 1fr auto` |
| **Colors & visual style** | Host app (via CSS vars) | `--toolbox-bg`, `--toolbox-text`, `--toolbox-accent`, etc. |

### Available CSS Custom Properties

| Variable | Fallback | Category |
|----------|----------|----------|
| `--toolbox-bg` | `transparent` | Host — kolor tła |
| `--toolbox-text` | `inherit` | Host — kolor tekstu |
| `--toolbox-border-color` | `transparent` | Host — kolor obramowania |
| `--toolbox-radius` | `0` | Host — border radius |
| `--toolbox-radius-sm` | `0` | Host — border radius (mały) |
| `--toolbox-gap` | `18px` | Library — odstępy layout |
| `--toolbox-accent` | `currentColor` | Host — kolor akcentu |
| `--toolbox-accent-text` | `inherit` | Host — tekst na akcencie |
| `--toolbox-accent-bg` | `transparent` | Host — tło akcentu |
| `--toolbox-muted` | `inherit` | Host — kolor muted |

### BEM Convention

All component styles use BEM naming:

- Block: `.toolbox__*` (e.g. `.toolbox__form`, `.toolbox__title`)
- Element: `.toolbox__field`, `.toolbox__select`, `.toolbox__submit`
- Modifier: `.toolbox__mode-btn--active`

This ensures no style conflicts with host app CSS.

---

## DEPRECATED: API Integration

> **Note**: The `ApiService` and `API_BASE_URL` InjectionToken are **deprecated**. The host app (GNUI) no longer uses a backend API — all music theory calculations are done locally via Tonal.js. These services remain in the library for backward compatibility but are not used by the current consumer.

### ApiService

[`ApiService`](projects/guitar-toolbox-lib/src/lib/api.service.ts) is an HTTP wrapper that:
1. Converts `musicElements` to a string (joins arrays with `,`)
2. Builds a URL: `{baseURL}/{type}s/{elements}/{keys}`
3. Makes a GET request via `HttpClient`

### API_BASE_URL Configuration

The base URL defaults to `http://localhost:3000/api` and is configurable via the [`API_BASE_URL`](projects/guitar-toolbox-lib/src/lib/api-config.token.ts) InjectionToken.

---

## DEPRECATED: Command Pattern

> **Note**: The `UICommands.ts` and `GuitarNeck.ts` files have been **removed** from the library. The host app no longer uses the Command pattern — it communicates directly via `FretboardCommand` events. These files existed in earlier versions for backward compatibility.