# Guitar Toolbox

An **Angular 18** monorepo containing a reusable Angular library (`guitar-toolbox-lib`) and a demo application for querying and displaying musical elements (scales, chords, notes) on a guitar fretboard.

## Project Structure

```
guitar-toolbox/
├── src/                          # Demo application (library consumer)
│   ├── app/
│   │   ├── app.component.ts      # Root component consuming lib-toolbox-form
│   │   ├── app.config.ts         # App bootstrap providers
│   │   └── app.routes.ts         # App routing
│   ├── main.ts                   # App entry point
│   └── styles.scss               # Global styles
├── projects/
│   └── guitar-toolbox-lib/       # 📦 Reusable Angular library
│       ├── src/lib/
│       │   ├── toolbox-form/     # Main form component (ToolboxFormComponent)
│       │   ├── custom-pattern/   # Custom interval pattern component (CustomPatternComponent)
│       │   ├── shared/           # Models & Command pattern classes
│       │   ├── api.service.ts    # Backend HTTP API wrapper
│       │   └── api-config.token.ts  # API_BASE_URL InjectionToken
│       ├── public-api.ts         # Public API surface
│       ├── README.md             # Library documentation
│       └── CHANGELOG.md          # Version history
├── angular.json                  # Angular workspace config
├── package.json                  # Workspace dependencies
└── BACKLOG.md                    # Feature/fix backlog
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- Angular CLI 18.2+ (`npm install -g @angular/cli@^18.2.0`)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the demo app dev server
npm start
# → http://localhost:4200

# 3. Build the library (when making changes to library code)
ng build guitar-toolbox-lib
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start demo app dev server |
| `npm run build` | Build demo app |
| `npm test` | Run demo app unit tests |
| `ng build guitar-toolbox-lib` | Build library |
| `ng test guitar-toolbox-lib` | Run library unit tests |
| `ng serve` | Alias for `npm start` |

## Library Documentation

For detailed library documentation — including installation, API reference, theming with CSS Custom Properties, and API URL configuration — see [projects/guitar-toolbox-lib/README.md](projects/guitar-toolbox-lib/README.md).

Additional architecture and design documents:

- [Architecture Overview](plans/architecture.md) — component tree, data flow, Command pattern
- [CSS Custom Properties Theming Guide](plans/css-theming-guide.md) — reference of all `--toolbox-*` theming variables
- [AGENTS.md](AGENTS.md) — AI agent development guidelines

## License

MIT
