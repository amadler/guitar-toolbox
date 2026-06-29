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
OPEN

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
OPEN

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
OPEN
