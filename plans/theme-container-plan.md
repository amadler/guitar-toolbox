# Plan implementacji — Theme Container + pozostałe poprawki

## 1. Podsumowanie audytu (stan obecny)

### ✅ Zrobione — biblioteka w pełni zamigrowana
- [`ToolboxFormComponent`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.html) — BEM + CSS vars ✅
- [`CustomPatternComponent`](projects/guitar-toolbox-lib/src/lib/custom-pattern/custom-pattern.component.html) — BEM + CSS vars ✅
- Obie biblioteczne specyfikacje SCSS używają `var(--toolbox-*)` z neutralnymi fallbackami ✅

### ❌ Do zrobienia — host app (`src/app/`)

| # | Zadanie | Pliki | Priorytet |
|---|---------|-------|-----------|
| A | Theme Container — zdefiniować CSS custom properties dla toolboxa | [`src/styles.scss`](src/styles.scss) | 🔴 P0 |
| B | Theme Container — opcjonalnie komponent wrapper | [`src/app/app.component.ts`](src/app/app.component.ts) | 🟠 P2 |
| C | Naprawa typu `ToolboxSearchQuery.musicElements` | [`projects/guitar-toolbox-lib/src/lib/shared/model/musicElements.ts`](projects/guitar-toolbox-lib/src/lib/shared/model/musicElements.ts) | 🔴 P1 |
| D | Naprawa testu `AppComponent.spec` (nieistniejący `title`) | [`src/app/app.component.spec.ts`](src/app/app.component.spec.ts) | 🟠 P2 |
| E | Zastąpienie `any` konkretnym typem w `AppComponent` | [`src/app/app.component.ts`](src/app/app.component.ts) | 🟡 P3 |

---

## 2. Zadanie A — Theme CSS Variables w styles.scss

### Cel
Zdefiniować globalne wartości dla CSS custom properties, których biblioteka oczekuje.

### Kontrakt CSS Variables (zgodny z [`plans/library-review.md §7.7`](plans/library-review.md:277))

| Variable | Fallback (library) | Proponowana wartość (theme) |
|----------|-------------------|---------------------------|
| `--toolbox-bg` | `transparent` | `#1e1e2e` (ciemny) |
| `--toolbox-text` | `inherit` | `#cdd6f4` (jasny tekst) |
| `--toolbox-border-color` | `transparent` | `#45475a` (subtle border) |
| `--toolbox-radius` | `0` | `8px` |
| `--toolbox-radius-sm` | `0` | `4px` |
| `--toolbox-gap` | `18px` | `18px` |
| `--toolbox-accent` | `currentColor` | `#89b4fa` (niebieski akcent) |
| `--toolbox-accent-text` | `inherit` | `#1e1e2e` (ciemny tekst na akcencie) |
| `--toolbox-accent-bg` | `transparent` | `rgba(137, 180, 250, 0.15)` |
| `--toolbox-muted` | `inherit` | `#6c7086` (muted text) |

### Miejsce

```scss
/* src/styles.scss */
:root {
  --toolbox-bg: #1e1e2e;
  --toolbox-text: #cdd6f4;
  --toolbox-border-color: #45475a;
  --toolbox-radius: 8px;
  --toolbox-radius-sm: 4px;
  --toolbox-gap: 18px;
  --toolbox-accent: #89b4fa;
  --toolbox-accent-text: #1e1e2e;
  --toolbox-accent-bg: rgba(137, 180, 250, 0.15);
  --toolbox-muted: #6c7086;
}
```

### Uzasadnienie wyboru `:root` zamiast komponentu-wrapper
- `:root` w `styles.scss` to globalny scope — nie wymaga refaktoryzacji szablonów
- CSS vars dziedziczą się w dół, więc każdy `lib-toolbox-form` w aplikacji automatycznie otrzyma theme
- Jeśli w przyszłości potrzeba wielu theme'ów, można dodać klasę `.theme-dark` / `.theme-light` na `body` i override'ować zmienne

---

## 3. Zadanie B — (Opcjonalny) Theme Container Component

### Decyzja architektoniczna
Theme container **nie jest wymagany** na tym etapie, ponieważ:
- Wszystkie zmienne są globalne (w `:root`)
- Aplikacja ma tylko jeden formularz toolboxa
- Nie ma potrzeby izolacji theme'ów w osobnych komponentach

**Jeśli jednak chcemy odseparować "dziedziczenie po theme kontenerze"** w rozumieniu komponentu, który definiuje zestaw zmiennych, możemy utworzyć:

`src/app/theme-container/theme-container.component.ts`
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-container',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: block;
      --toolbox-bg: #1e1e2e;
      /* ... reszta zmiennych */
    }
  `]
})
export class ThemeContainerComponent {}
```

**Rekomendacja:** Zacząć od `:root` (Zadanie A). Dodać komponent-wrapper tylko jeśli pojawi się potrzeba wielu theme'ów.

---

## 4. Zadanie C — Rozszerzenie typu `ToolboxSearchQuery.musicElements`

### Problem
- [`musicElements`](projects/guitar-toolbox-lib/src/lib/shared/model/musicElements.ts:2) jest typu `string`
- [`CustomPatternComponent.onSubmit()`](projects/guitar-toolbox-lib/src/lib/custom-pattern/custom-pattern.component.ts:33-35) przypisuje `intervals` (typ `number[]`) do `musicElements`

### Rozwiązanie

```typescript
// musicElements.ts
export interface ToolboxSearchQuery {
  musicElements: string | number[];  // Rozszerzamy
  keys: string;
  type: QueryTypes;
}
```

### Skutki uboczne
- Konieczna aktualizacja [`ToolboxFormComponent.onSubmit()`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.ts:55-61) — emitowany `musicElements` to `string`, więc jest OK, ale typ się zmienia → sprawdzić zgodność
- Sprawdzić [`toolbox-form.component.spec.ts:56-60`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.spec.ts:56-60) — oczekuje `musicElements: 'Single note'` (string) → OK

---

## 5. Zadanie D — Naprawa `AppComponent.spec`

### Problem
- [`src/app/app.component.spec.ts:17-21`](src/app/app.component.spec.ts:17-21) testuje `expect(app.title).toEqual('guitar-toolbox')`
- [`src/app/app.component.ts`](src/app/app.component.ts) nie ma właściwości `title`

### Rozwiązanie
Usunąć testy odnoszące się do `title` i `h1` (to nie jest aplikacja z domyślnym szablonem Angularowym).

---

## 6. Zadanie E — Zastąpienie `any` typem `ToolboxSearchQuery`

### Problem
- [`src/app/app.component.ts:14`](src/app/app.component.ts:14): `toolboxSubmit(query: any)`

### Rozwiązanie

```typescript
import { ToolboxSearchQuery } from 'guitar-toolbox-lib';

toolboxSubmit(query: ToolboxSearchQuery) {
  console.log('Received query:', query);
}
```

---

## 7. Diagram przepływu — stan docelowy

```mermaid
flowchart TD
    subgraph "Library (guitar-toolbox-lib)"
        TFC[ToolboxFormComponent<br/>BEM + CSS vars]
        CPC[CustomPatternComponent<br/>BEM + CSS vars]
        TSQ[ToolboxSearchQuery<br/>musicElements: string | number[]]
    end

    subgraph "Host App (src/app)"
        AC[AppComponent]
        GS[styles.scss - :root<br/>definiuje --toolbox-* vars]
        SPEC[app.component.spec.ts<br/>fixed: no title test]
    end

    GS -->|provides theme| TFC
    GS -->|provides theme| CPC
    AC -->|imports| TFC
    AC -->|typed: ToolboxSearchQuery| TSQ
    SPEC -->|passes| AC

    style TFC fill:#99FF99
    style CPC fill:#99FF99
    style GS fill:#99FF99
    style TSQ fill:#99FF99
    style AC fill:#99FF99
    style SPEC fill:#FFFF99
```

---

## 8. Kolejność implementacji

| Krok | Zadanie | Szac. nakład | Uwagi |
|------|---------|-------------|-------|
| 1 | **A** — Theme CSS vars w `styles.scss` | 5 min | Proste dodanie zmiennych |
| 2 | **C** — Rozszerzenie `ToolboxSearchQuery.musicElements` | 5 min | Zmiana typu w interfejsie |
| 3 | **D** — Naprawa `AppComponent.spec` | 5 min | Usunięcie nieaktualnych testów |
| 4 | **E** — Typ `ToolboxSearchQuery` zamiast `any` | 5 min | Import + zmiana typu |
| 5 | **B** — (opcjonalnie) Theme Container Component | 15 min | Tylko jeśli chcemy separacji |
| 6 | Uruchomienie testów (`npm test`) | 2 min | Weryfikacja całości |

---

## 9. Pytania do dyskusji

1. **`:root` vs komponent-wrapper?** — Czy globalne zmienne w `styles.scss` wystarczą, czy chcemy osobny komponent `ThemeContainer`?
2. **Paleta kolorów** — Czy zaproponowana paleta (ciemna, Catppuccin Mocha-inspired) jest OK, czy wolisz coś innego?
3. **Czy chcesz od razu dodać `theme-light` class jako alternatywę?**
4. **Czy `ToolboxSearchQuery.musicElements` jako `string | number[]` jest wystarczające, czy wolisz osobny typ (np. `MusicElementQuery = string | number[]`)?**
