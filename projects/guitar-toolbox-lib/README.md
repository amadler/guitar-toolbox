# GuitarToolboxLib — `guitar-toolbox-lib`

An **Angular 18** reusable library for selecting and querying musical elements (scales, chords, notes) to display on a guitar fretboard. Consumed by a host application that provides a [`NoteSelector`](src/lib/shared/UICommands.ts:5) implementation.

**Package:** `guitar-toolbox-lib` · **Version:** [1.2.3](package.json:3) · **License:** MIT

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Components](#components)
  - [Services](#services)
  - [Commands (Command Pattern)](#commands-command-pattern)
  - [Models](#models)
- [Theming with CSS Custom Properties](#theming-with-css-custom-properties)
- [Configuring the API URL](#configuring-the-api-url)
- [Building and Publishing](#building-and-publishing)
- [Changelog](CHANGELOG.md)

---

## Installation

```bash
npm install guitar-toolbox-lib
```

**Peer dependencies** (must be installed in the host app):

- `@angular/common` ^18.2.0
- `@angular/core` ^18.2.0
- `guitar-neck-shared` ^1.0.0
- `@angular/forms` (for ReactiveFormsModule)
- `@angular/common/http` (for ApiService)

---

## Quick Start

### 1. Register the component

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ToolboxFormComponent, ToolboxSearchQuery } from 'guitar-toolbox-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolboxFormComponent],
  template: `
    <lib-toolbox-form (onSubmit)="toolboxSubmit($event)"></lib-toolbox-form>
  `
})
export class AppComponent {
  toolboxSubmit(query: ToolboxSearchQuery) {
    console.log('Query:', query);
    // → { musicElements: 'Major', keys: 'C', type: 'scale' }
  }
}
```

### 2. (Optional) Provide HTTP client if using ApiService

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
```

### 3. Apply a theme (optional)

The library uses [`--toolbox-*` CSS custom properties](#theming-with-css-custom-properties). The host app defines these to control colors, borders, and typography:

```scss
lib-toolbox-form {
  --toolbox-bg: #ffffff;
  --toolbox-text: #1a1a1a;
  --toolbox-accent: #2563eb;
  --toolbox-accent-text: #ffffff;
  --toolbox-border-color: #e2e8f0;
  --toolbox-radius: 8px;
  --toolbox-radius-sm: 4px;
  --toolbox-gap: 18px;
  --toolbox-accent-bg: rgba(37, 99, 235, 0.08);
  --toolbox-muted: #94a3b8;
}
```

---

## API Reference

### Components

#### `ToolboxFormComponent` — `lib-toolbox-form`

The main form for selecting standard musical patterns (scales, chords, single notes, all notes).

**Selector:** `lib-toolbox-form`  
**Standalone:** ✅ Yes

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `onSubmit` | `EventEmitter<ToolboxSearchQuery>` | Emitted when the user submits the form |

**Usage:**

```html
<lib-toolbox-form (onSubmit)="handleQuery($event)"></lib-toolbox-form>
```

The form has two modes:
- **Standard** — select a type (Basic / Scale / Chord), then a pattern and key
- **Custom** — switch to [`CustomPatternComponent`](#custompatterncomponent) for entering manual intervals

---

#### `CustomPatternComponent` — `lib-custom-pattern`

A sub-component for entering custom interval patterns manually. Displayed inside `ToolboxFormComponent` when the "Custom" tab is active.

**Selector:** `lib-custom-pattern`  
**Standalone:** ✅ Yes

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `onCustomPatternSubmit` | `EventEmitter<ToolboxSearchQuery>` | Emitted when the custom pattern form is submitted |

**Form fields:**
- **Intervals** — comma-separated numbers (e.g. `1,3,5` for a major triad)
- **Root note** — select from chromatic notes (C, C#, D, ...)

---

### Services

#### `ApiService`

HTTP client for sending `ToolboxSearchQuery` payloads to a backend API.

**Provided in:** `root`  
**Dependency:** `HttpClient`

**Constructor injection:**

```typescript
constructor(private api: ApiService) { }

this.api.sendToolboxRequest(query).subscribe(response => {
  // handle response
});
```

**Method:** `sendToolboxRequest(query)` — sends a GET request to `{API_BASE_URL}/{type}s/{musicElements}/{keys}`.

The base URL is configurable via [`API_BASE_URL`](#configuring-the-api-url).

---

### Commands (Command Pattern)

The library implements the **Command pattern** to decouple UI form submission from fretboard rendering. Commands accept a [`NoteSelector`](src/lib/shared/UICommands.ts:5) interface that the host application implements.

#### `NoteSelector` interface

```typescript
interface NoteSelector {
  selectChord(triadName: string, rootNote: string): any;
  selectScale(scaleName: string, rootNote: string): any;
  selectNote(noteName: string): void;
  selectAllNotes(): void;
  selectNotes(notes: string[], rootNote: string): any;
}
```

#### Command classes

| Class | Constructor | Description |
|-------|-------------|-------------|
| [`DisplaySingleNoteCommand`](src/lib/shared/UICommands.ts:17) | `(noteSelector, keys)` | Displays a single note on the fretboard |
| [`DisplayAllNotesCommand`](src/lib/shared/UICommands.ts:27) | `(noteSelector)` | Displays all notes |
| [`DisplayScaleCommand`](src/lib/shared/UICommands.ts:35) | `(noteSelector, scaleName, rootNote)` | Displays a scale pattern |
| [`DisplayChordCommand`](src/lib/shared/UICommands.ts:51) | `(noteSelector, triadName, rootNote)` | Displays a chord pattern |
| [`DisplayCustomPatternCommand`](src/lib/shared/UICommands.ts:67) | `(noteSelector, intervals, rootNote)` | Displays notes from custom intervals |

**Example usage in a host app:**

```typescript
import {
  DisplayScaleCommand, NoteSelector
} from 'guitar-toolbox-lib';

class MyFretboardService implements NoteSelector {
  selectScale(scaleName: string, rootNote: string) {
    // Render scale on fretboard...
    return of([]);
  }
  // ... implement other methods
}

const command = new DisplayScaleCommand(mySelector, 'Major', 'C');
command.execute();
```

---

### Models

#### `ToolboxSearchQuery`

```typescript
interface ToolboxSearchQuery {
  musicElements: string | number[];  // Pattern name or interval array
  keys: string;                      // Root note (e.g. 'C', 'G#')
  type: QueryTypes;                  // 'basic' | 'scale' | 'chord' | 'custom'
}
```

#### `QueryTypes`

```typescript
type QueryTypes = 'scale' | 'chord' | 'basic' | 'custom';
```

---

## Theming with CSS Custom Properties

All visual properties (colors, borders, spacing) are controlled by CSS Custom Properties. The host application sets these on the `lib-toolbox-form` element (or any ancestor) to theme the form.

### Full property reference

| Property | Default | Affects |
|----------|---------|---------|
| `--toolbox-bg` | `transparent` | Background of inputs, selects, buttons |
| `--toolbox-text` | `inherit` | Text and label color |
| `--toolbox-accent` | `currentColor` | Active tab border, submit button background, focus ring, hover accent |
| `--toolbox-accent-text` | `inherit` | Submit button text color |
| `--toolbox-accent-bg` | `transparent` | Active tab background |
| `--toolbox-border-color` | `transparent` | Border of inputs, selects, buttons |
| `--toolbox-radius` | `0` | Outer border radius (buttons, mode tabs) |
| `--toolbox-radius-sm` | `0` | Inner border radius (inputs, selects) |
| `--toolbox-gap` | `18px` | Grid gap between form fields |
| `--toolbox-muted` | `inherit` | Helper/hint text |

> **Note:** Layout values (padding, margin, font-size, grid columns) have real CSS fallbacks in the library and are intentionally not customizable to preserve consistent geometry.

---

## Configuring the API URL

The `API_BASE_URL` InjectionToken allows you to override the default API endpoint (`http://localhost:3000/api`).

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'guitar-toolbox-lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: API_BASE_URL, useValue: 'https://api.myguitarapp.com/api' }
  ]
};
```

---

## Building and Publishing

```bash
# Build the library
ng build guitar-toolbox-lib

# Run tests
ng test guitar-toolbox-lib

# Publish to npm (from dist/)
cd dist/guitar-toolbox-lib
npm publish
```

For versioning, update [`package.json`](package.json:3) and add an entry to [`CHANGELOG.md`](CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
