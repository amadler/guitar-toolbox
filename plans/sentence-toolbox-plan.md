# Plan: Sentence-based Toolbox (Mad Libs style)

## WAŻNE: Zasady pracy

1. **Guitar neck UI** — nowa gałąź od `feat/scale-chord-relationship`, NIE od `master`.
2. **Brak commitów** bez recenzji — ani w toolboxie, ani w Guitar neck UI.
3. **Change detection** — zmiana chipa (np. `scale` → `chord`) musi natychmiast aktualizować zdanie. Użyj `ChangeDetectionStrategy.OnPush` + `ChangeDetectorRef.markForCheck()` lub `signal()`. Nie używaj zwykłych pól które mogą się zaklinować.

## Cel

Przebudować `ToolboxBuilderComponent` z klasycznego formularza na sentence-based control (Mad Libs style). Zachować istniejące kontrakty (`FretboardCommand`, `ShowCommand`, `CompareCommand`). Dodać obsługę nowego kontraktu w Guitar neck UI.

## Ustalenia

| Decyzja | Wartość |
|---------|---------|
| Strategia | Kompleksowa — plan, potem implementacja w jednym przebiegu |
| Stare komponenty | Zastąpione, ale zachowujemy `FormsWrapperComponent` jako otoczkę |
| Nowy komponent | Przebudowa istniejącego `ToolboxBuilderComponent` |
| Model | `FretboardCommand`, `ShowCommand`, `CompareCommand` pozostają |
| UI chipów | Autocomplete/typeahead zawężający wyniki, stylizowany jak chip w zdaniu |
| Przycisk | Jeden przycisk "Show" dla obu trybów |
| AppMode | Znika — HomePageComponent wnioskuje z typu FretboardCommand |
| Helper interwałów | W bibliotece (guitar-toolbox-lib), exportowany przez public-api |
| Predefiniowane patterny | W bibliotece, jako stała `PREDEFINED_PATTERNS` |

## Architektura

### Przepływ danych

```
ToolboxBuilderComponent (sentence-based)
  │
  ├── intent: 'show' | 'compare'          ← pierwszy wybór
  ├── showKind: 'scale' | 'chord' | 'intervalPattern'  ← gdy Show
  │
  ├── ShowScaleCommand { kind:'scale', key, scaleType }
  ├── ShowChordCommand { kind:'chord', key, chordType }
  ├── ShowIntervalPatternCommand { kind:'intervalPattern', key, intervals }
  └── CompareCommand { kind:'scaleChordRelation', scaleKey, scaleType, chordKey, chordType }
  │
  └── @Output() toolboxEvent: FretboardCommand
       │
       └── HomePageComponent.onToolboxEvent(command)
            │
            ├── switch (command.kind):
            │   ├── 'scale' → displayScale + showLegend
            │   ├── 'chord' → displayChord + showLegend
            │   ├── 'intervalPattern' → displayCustomPattern + showLegend
            │   └── 'scaleChordRelation' → displayScaleWithChord + showRelationshipStrip
            │
            └── (AppMode znika — wnioskowanie z typu komendy)
```

### UI — zdania

```
Tryb Show:
  Show [scale▼] [C▼] [major▼] on fretboard        [Show]

  Show [chord▼] [C▼] [minor▼] on fretboard         [Show]

  Show [interval pattern▼] [major triad▼] in [C▼] on fretboard  [Show]

Tryb Compare:
  Compare scale [C▼] [major▼] with chord [C▼] [major▼]  [Show]
```

### Widoczność komponentów (HomePageComponent)

| Typ komendy | Legenda | Relationship Strip | Markers |
|-------------|---------|-------------------|---------|
| `ShowScaleCommand` | ✅ | ❌ | ✅ |
| `ShowChordCommand` | ✅ | ❌ | ✅ |
| `ShowIntervalPatternCommand` | ✅ | ❌ | ✅ |
| `CompareCommand` | ❌ | ✅ | ❌ |

## Plany implementacji

### Część 1: Biblioteka (guitar-toolbox-lib)

#### 1a. Helper interwałów — `interval-utils.ts`

Nowy plik: `projects/guitar-toolbox-lib/src/lib/shared/interval-utils.ts`

- Funkcja `intervalsToNoteNames(root: MusicKey, intervals: Interval[]): string[]`
  - Mapuje `Interval[]` (np. `['1', 'b3', '5']`) na nazwy nut (np. `['C', 'Eb', 'G']`)
  - Używa `neckConfig.chromaticNotes` (tymczasowo, potem własna stała)
- Stała `PREDEFINED_PATTERNS: PredefinedPattern[]` — generowana **automatycznie** z `CHORD_PATTERNS` (26 akordów) + `{ label: 'single note', intervals: ['1'] }`
  - Każdy `CHORD_PATTERNS` ma `intervals: number[]` (kroki kumulatywne, np. `major: [4,3]`)
  - Helper konwertuje na `Interval[]` absolutne (np. `[4,3]` → `['1', '3', '5']`)
  - Pełna lista: major, minor, diminished, augmented, dominant-7th, major-7th, minor-7th, half-diminished-7th, diminished-7th, 9, minor-9, major-9, 11, minor-11, 13, minor-13, sus2, sus4, add9, add11, add13, 7♭5, 7♯5, 7♭9, 7♯9, 5 + single note
- Export przez `public-api.ts`

#### 1b. Przebudowa `ToolboxBuilderComponent`

**Model** (`model.ts`):
- Dodać `PredefinedPattern` type (label + intervals)
- Dodać `ShowIntervalPatternCommand.intervals` jako `Interval[]`
- Dodać `PREDEFINED_PATTERNS` do modelu lub osobnego pliku

**Komponent** (`toolbox.builder.component.ts`):
- Usunąć `ReactiveFormsModule`, `FormBuilder`, `FormGroup`
- Zastąpić prostym stanem: `intent`, `showKind`, `selectedKey`, `selectedScale`, `selectedChord`, `selectedPattern`
- **`ChangeDetectionStrategy.OnPush`** — wszystkie zmiany stanu przez `signal()` (np. `intent: WritableSignal<Intent>`, `showKind: WritableSignal<ShowKind>`, itd.). Zmiana chipa natychmiast przebudowuje zdanie bez blokady.
- Dodać `@Output() toolboxEvent: EventEmitter<FretboardCommand>` (zachować)
- Metoda `submit()` → buduje odpowiedni `FretboardCommand` i emituje

**Template** (`toolbox.builder.component.html`):
- Mad Libs sentence z inline chip/select
- `I want to: [Show] [Compare]` — przełącznik
- Dynamiczne zdanie zależne od trybu
- Autocomplete/typeahead dla każdego chipa
- Przycisk `[Show]` na końcu

**Style** (`toolbox.builder.component.scss`):
- Inline chip/select — wygląd jak część zdania
- Wszystko w jednej linii
- Stałe odstępy między elementami
- BEM convention

#### 1c. Export przez `public-api.ts`

- Dodać export `interval-utils`
- Dodać export `PREDEFINED_PATTERNS`

### Część 2: Guitar neck UI

#### 2a. Obsługa `FretboardCommand` w `HomePageComponent`

- Dodać handler `onToolboxEvent(command: FretboardCommand)`
- Switch po `command.kind`:
  - `'scale'` → `displayScale(command.key, command.scaleType)` + show legend
  - `'chord'` → `displayChord(command.key, command.chordType)` + show legend
  - `'intervalPattern'` → `displayCustomPattern(intervalsToNoteNames(command.key, command.intervals), command.key)` + show legend
  - `'scaleChordRelation'` → `displayScaleWithChord(command.scaleKey, command.scaleType, command.chordKey, command.chordType)` + show relationship strip
- Usunąć `AppMode` — zastąpić `displayMode: 'legend' | 'relationship' | null`
- Usunąć `onAppModeChange` z `FormsWrapperComponent`

#### 2b. Aktualizacja `FormsWrapperComponent`

- Usunąć stare komponenty (`ScaleOrChordComponent`, `CustomPatternComponent`, `ScaleChordFormComponent`)
- Zostawić tylko `ToolboxBuilderComponent`
- Usunąć `onAppModeChange` output
- Zachować `toolboxEv` output

#### 2c. Aktualizacja `home-page.component.html`

- Usunąć `(onAppModeChange)` binding
- Zmienić warunki widoczności Legendy i Relationship Strip na podstawie `displayMode`

### Kolejność implementacji

1. `interval-utils.ts` + `PREDEFINED_PATTERNS` w bibliotece
2. Export przez `public-api.ts`
3. Przebudowa `ToolboxBuilderComponent` (TS + HTML + SCSS)
4. Aktualizacja `FormsWrapperComponent`
5. Obsługa `FretboardCommand` w `HomePageComponent`
6. Aktualizacja `home-page.component.html`
7. Testy

### Diagram przepływu

```mermaid
flowchart TD
    A[Użytkownik wybiera Show/Compare] --> B{Pierwszy chip}
    B -->|Show| C[Wybierz kind: scale/chord/interval pattern]
    B -->|Compare| D[Wybierz scale + chord]
    C --> E[Wybierz key + pattern]
    D --> F[Wybierz key dla scale i chord]
    E --> G[Kliknij Show]
    F --> G
    G --> H{Typ komendy}
    H -->|ShowScaleCommand| I[displayScale + legenda]
    H -->|ShowChordCommand| J[displayChord + legenda]
    H -->|ShowIntervalPatternCommand| K[displayCustomPattern + legenda]
    H -->|CompareCommand| L[displayScaleWithChord + relationship strip]
    I --> M[Tobox pozostaje widoczny]
    J --> M
    K --> M
    L --> M
    M --> B