# BACKLOG.md

---

# Rozszerzenie typu ToolboxSearchQuery — musicElements jako string | number[]

## Motivation
CustomPatternComponent wysyła `musicElements` jako `number[]` (tablica interwałów), ale interfejs `ToolboxSearchQuery` definiuje to pole jako `string`. Powoduje to błąd TypeScript i potencjalne problemy w runtime po stronie konsumenta, który oczekuje stringa.

## Solution
Zmienić typ `musicElements` w interfejsie `ToolboxSearchQuery` na `string | number[]`, a `type` rozszerzyć o `'custom'`. Zaktualizować wszystkich konsumentów tego interfejsu wewnątrz biblioteki.

## MVP
1. Modyfikacja interfejsu w `musicElements.ts`
2. Aktualizacja konsumentów: `ToolboxFormComponent`, `CustomPatternComponent`
3. Aktualizacja testów

## Done when
- TypeScript nie zgłasza błędów w żadnym pliku biblioteki
- Wszystkie testy przechodzą
- Typ `ToolboxSearchQuery.musicElements` akceptuje `string | number[]`

## Status
FIXED

---

# Konfigurowalny URL API przez InjectionToken

## Motivation
ApiService ma na sztywno zakodowany URL `http://localhost:3000/api`. Uniemożliwia to deploy biblioteki w różnych środowiskach (dev, staging, production) bez modyfikowania kodu źródłowego. Jest to również znane ryzyko opisane w AGENTS.md.

## Solution
Wprowadzić `InjectionToken<string>` o nazwie `API_BASE_URL` z domyślną wartością `http://localhost:3000/api`. ApiService powinien korzystać z tego tokena zamiast hardcodowanego stringa. Konsument może nadpisać wartość w `app.config.ts` przez `{ provide: API_BASE_URL, useValue: 'https://api.production.com/api' }`.

## MVP
1. Utworzenie InjectionToken `API_BASE_URL` w osobnym pliku lub w api.service.ts
2. Modyfikacja ApiService — wstrzyknięcie tokena
3. Eksport tokena w public-api.ts
4. Dokumentacja w README

## Done when
- ApiService używa `@Inject(API_BASE_URL)` zamiast hardcodowanego stringa
- Konsument może skonfigurować URL przez provider
- Wszystkie testy przechodzą z domyślną i nadpisaną wartością

## Status
FIXED

---

# BEM markup + CSS Custom Properties API dla toolbox-form i custom-pattern

## Motivation
Biblioteka `guitar-toolbox-lib` używa starych nazw klas CSS (`.form-row`, `.form-select`, `.section-title`, `.mode-selector`) i hardcodowanych kolorów (`#004400`, `#ccc`, `white`). Nowa strategia architektoniczna wymaga:
1. BEM naming convention (`.toolbox__*`, `.toolbox__*--*`)
2. CSS Custom Properties API z neutralnymi fallbackami (`transparent`, `inherit`, `currentColor`)
3. Zero hardcodowanych kolorów w bibliotece — host app dostarcza wartości przez CSS vars
4. Layout/geometria pozostaje w bibliotece z realnymi wartościami fallback

## Solution
1. Zastąpienie `templateUrl`/`styleUrls` w obu komponentach na `template`/`styles` inline (zgodnie z wytycznymi architekta)
2. Nowy BEM markup w szablonach: `.toolbox__title`, `.toolbox__mode-selector`, `.toolbox__mode-btn`, `.toolbox__mode-btn--active`, `.toolbox__form`, `.toolbox__field`, `.toolbox__label`, `.toolbox__select`, `.toolbox__submit`, `.toolbox__custom-form`, `.toolbox__input`, `.toolbox__hint`
3. Nowe style SCSS inline z CSS vars: `var(--toolbox-bg, transparent)`, `var(--toolbox-text, inherit)`, `var(--toolbox-border-color, transparent)`, `var(--toolbox-radius, 0)`, `var(--toolbox-gap, 18px)`, `var(--toolbox-accent, currentColor)`, itd.
4. Usunięcie hardcodowanych `[style.backgroundColor]="'#004400'"` i `[style.color]="'#ffffff'"`
5. Ewentualna aktualizacja testów, jeśli query CSS się zmieniają

## MVP
1. Migracja ToolboxFormComponent — template + styles
2. Migracja CustomPatternComponent — template + styles
3. Weryfikacja `ng build` bez błędów
4. Weryfikacja testów

## Done when
- Oba komponenty używają wyłącznie `.toolbox__*` klas BEM
- Żaden plik biblioteki nie zawiera hardcodowanych kolorów/border-radius/background
- Wszystkie wartości wizualne używają `var(--toolbox-*)` z neutralnymi fallbackami
- Layout i geometria (grid, flex, gap, padding) mają realne wartości fallback
- `ng build` przechodzi bez błędów

## Status
FIXED

---

# Zmiana nazwy @Output z onSubmit$ na onSubmit

## Motivation
EventEmitter w ToolboxFormComponent ma nazwę `onSubmit$`, gdzie sufiks `$` w Angular/RxJS konwencjonalnie oznacza Observable. EventEmitter nie jest Observable w kontekście szablonów — użycie `$` wprowadza w błąd i jest niespójne z konwencją Angular.

## Solution
Zmienić nazwę `@Output() onSubmit$` na `@Output() onSubmit` w ToolboxFormComponent i zaktualizować szablon app.component.html konsumenta, który binduje się do `(onSubmit$)`.

## MVP
1. Zmiana nazwy w ToolboxFormComponent
2. Aktualizacja szablonu w app.component.html
3. Aktualizacja testów

## Done when
- W bibliotece nie ma już `onSubmit$` — wszędzie jest `onSubmit`
- Konsument używa `(onSubmit)` w szablonie
- Wszystkie testy przechodzą

## Status
FIXED

---

# Wyrównanie stylów Custom Pattern do spójności z zakładką Standard Patterns

## Motivation
Custom Pattern component (`.toolbox__custom-form`) ma inny layout niż Standard Patterns (`.toolbox__form`). Standard Patterns używa siatki CSS (`grid-template-columns: 1fr 1fr 1fr auto`), podczas gdy Custom Pattern używa `flex-direction: row` z `padding: 0 25%`. Powoduje to niespójny wygląd między zakładkami.

## Solution
Dostosować style `.toolbox__custom-form` i jego elementów potomnych w [`custom-pattern.component.scss`](projects/guitar-toolbox-lib/src/lib/custom-pattern/custom-pattern.component.scss) do layoutu używanego w `.toolbox__form`, zachowując przy tym spójne:
- użycie `var(--toolbox-*)` dla kolorów i border-radius
- Wyrównanie do siatki/grid (tak samo jak Standard Patterns)
- Ten sam `gap`, `font-size`, `height` dla select/input/button

## MVP
1. Zmiana `.toolbox__custom-form` z `flex` na `grid` (lub inny spójny layout)
2. Wyrównanie wysokości inputów i przycisków do standardów z `.toolbox__form`
3. Usunięcie `padding: 0 25%` na rzecz `max-width` lub grid alignment
4. Weryfikacja wizualna: obie zakładki wyglądają spójnie

## Done when
- `.toolbox__custom-form` i `.toolbox__form` mają spójny layout i odstępy
- Inputy, selecty i buttony w Custom Pattern mają ten sam rozmiar co w Standard Patterns
- Wszystkie style używają `var(--toolbox-*)` z neutralnymi fallbackami
- `ng build` i testy przechodzą

## Status
OPEN

---

# Sort scales and chords alphabetically in Toolbox selects

## Motivation
The `patterns.scale` and `patterns.chord` arrays in [`toolbox-form.component.ts`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.ts:29-33) appear in the order defined by the `SCALE_PATTERNS` and `CHORD_PATTERNS` constants from `guitar-neck-shared`, which may not be alphabetical. This makes it harder for users to find specific scales or chords in the `<select>` dropdowns — a basic UX expectation.

## Solution
Append `.sort()` to the `.map()` calls that build the `patterns.scale` and `patterns.chord` arrays. The change is minimal and localized to lines 31–32 of [`toolbox-form.component.ts`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.ts).

## MVP
1. Add `.sort()` to `SCALE_PATTERNS.map(scale => scale.name)` on line 31
2. Add `.sort()` to `CHORD_PATTERNS.map(chord => chord.name)` on line 32
3. Verify `ng build guitar-toolbox-lib` passes

## Done when
- Both `patterns.scale` and `patterns.chord` arrays are sorted alphabetically
- `ng build` for the library project passes without errors
- Both `<select>` dropdowns display options in alphabetical order

## Status
OPEN
