# Guitar Toolbox — Architecture Overview

## Table of Contents

- [Monorepo Layout](#monorepo-layout)
- [Component Tree](#component-tree)
- [Data Flow](#data-flow)
- [Command Pattern](#command-pattern)
- [API Integration](#api-integration)
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
│       │   ├── toolbox-form/       ← ToolboxFormComponent
│       │   ├── custom-pattern/     ← CustomPatternComponent
│       │   ├── shared/             ← UICommands.ts, GuitarNeck.ts, model/
│       │   ├── api.service.ts      ← HTTP wrapper for backend
│       │   └── api-config.token.ts ← API_BASE_URL InjectionToken
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
└── lib-toolbox-form [ToolboxFormComponent]
    ├── (Standard mode form)
    │   ├── Type selector (Basic | Scale | Chord)
    │   ├── Pattern selector (dynamic based on type)
    │   ├── Key selector (C, C#, D, ...)
    │   └── Submit button
    └── (Custom mode form)
        └── lib-custom-pattern [CustomPatternComponent]
            ├── Intervals input (comma-separated numbers)
            ├── Root note selector
            └── Submit button
```

The two modes are mutually exclusive — toggled by the **Standard** / **Custom** tab buttons.

---

## Data Flow

### Standard Mode

```
User selects Type → valueChanges triggers availablePatterns update
User selects Pattern + Key
User clicks "Show" → submitForm()

submitForm():
  └─ builds ToolboxSearchQuery {
       musicElements: string (pattern name),
       keys: string (root note),
       type: QueryTypes ('basic' | 'scale' | 'chord')
     }
  └─ emits via @Output() onSubmit
```

### Custom Mode

```
User enters intervals (e.g. "1,3,5")
User selects root note
User clicks "Show Pattern" → CustomPatternComponent.onSubmit()

onSubmit():
  └─ parses interval string → number[] (e.g. [1, 3, 5])
  └─ builds ToolboxSearchQuery {
       musicElements: number[] (intervals),
       keys: string (root note),
       type: 'custom'
     }
  └─ emits via @Output() onCustomPatternSubmit
     └─ ToolboxFormComponent.onCustomPatternSubmit() re-emits via @Output() onSubmit
```

### Consumer Integration

The host app binds to `(onSubmit)` and can:

1. **Send the query to a backend** via [`ApiService.sendToolboxRequest()`](../projects/guitar-toolbox-lib/src/lib/api.service.ts:16)
2. **Use the Command pattern** to execute display logic directly
3. **Both** — send to API and render from the response

```
Host App
  ├─ (onSubmit)="handleQuery($event)"
  │
  ├─ Option A: ApiService.sendToolboxRequest(query)
  │   └─ GET {API_BASE_URL}/{type}s/{musicElements}/{keys}
  │
  └─ Option B: Command.execute()
      └─ NoteSelector.scale/chord/note method
```

---

## Command Pattern

The library implements the **GoF Command pattern** to provide a clean, testable way for host apps to execute fretboard display logic.

### Participants

| Role | Implementation |
|------|---------------|
| **Command** | [`Command` interface](../projects/guitar-toolbox-lib/src/lib/shared/UICommands.ts:13) — `{ execute(): void }` |
| **Concrete Commands** | `DisplaySingleNoteCommand`, `DisplayAllNotesCommand`, `DisplayScaleCommand`, `DisplayChordCommand`, `DisplayCustomPatternCommand` |
| **Receiver** | [`NoteSelector` interface](../projects/guitar-toolbox-lib/src/lib/shared/UICommands.ts:5) — implemented by the host app |
| **Invoker** | Consumer code (host app) that creates and executes commands |

### Benefits

- **Decoupling** — The library doesn't know how the host renders notes on the fretboard
- **Testability** — Commands can be unit-tested with mock `NoteSelector` implementations
- **Extensibility** — New commands can be added without changing existing code

---

## API Integration

### ApiService

[`ApiService`](../projects/guitar-toolbox-lib/src/lib/api.service.ts) is an HTTP wrapper that:

1. Converts `musicElements` to a string (joins arrays with `,`)
2. Builds a URL: `{baseURL}/{type}s/{elements}/{keys}`
3. Makes a GET request via `HttpClient`

**Examples:**

| Query | Generated URL |
|-------|--------------|
| `{ type: 'scale', musicElements: 'Major', keys: 'C' }` | `/api/scales/Major/C` |
| `{ type: 'chord', musicElements: 'maj', keys: 'G' }` | `/api/chords/maj/G` |
| `{ type: 'custom', musicElements: [1,3,5], keys: 'D' }` | `/api/customs/1,3,5/D` |
| `{ type: 'basic', musicElements: 'All notes', keys: 'C' }` | `/api/basics/All notes/C` |

### API_BASE_URL Configuration

The base URL defaults to `http://localhost:3000/api` and is configurable via the [`API_BASE_URL`](../projects/guitar-toolbox-lib/src/lib/api-config.token.ts:17) InjectionToken. See [library README](../projects/guitar-toolbox-lib/README.md#configuring-the-api-url) for usage.

---

## Theming Strategy

### Separation of concerns

| Category | Who defines | Examples |
|----------|------------|---------|
| **Layout & geometry** | Library (hardcoded fallbacks) | `height: 40px`, `gap: var(--toolbox-gap, 18px)`, `grid-template-columns: 1fr 1fr 1fr auto` |
| **Colors & visual style** | Host app (via CSS vars) | `--toolbox-bg`, `--toolbox-text`, `--toolbox-accent`, etc. |

### Available CSS Custom Properties

See the [CSS Theming Guide](css-theming-guide.md) for a complete reference.

### BEM Convention

All component styles use BEM naming:

- Block: `.toolbox__*` (e.g. `.toolbox__form`, `.toolbox__title`)
- Element: `.toolbox__field`, `.toolbox__select`, `.toolbox__submit`
- Modifier: `.toolbox__mode-btn--active`

This ensures no style conflicts with host app CSS.
