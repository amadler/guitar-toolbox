# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Root-level CHANGELOG.md tracking the full monorepo release history

## [1.2.0] — 2026-07-01

### Fixed
- **Type mismatch in `ToolboxSearchQuery.musicElements`**: changed type from `string` to `string | number[]` to support both named patterns and custom interval arrays ([`musicElements.ts`](projects/guitar-toolbox-lib/src/lib/shared/model/musicElements.ts), [`api.service.ts`](projects/guitar-toolbox-lib/src/lib/api.service.ts))
- **Configurable API URL**: introduced `API_BASE_URL` InjectionToken with default `http://localhost:3000/api`, consumers can now override via provider ([`api-config.token.ts`](projects/guitar-toolbox-lib/src/lib/api-config.token.ts), [`api.service.ts`](projects/guitar-toolbox-lib/src/lib/api.service.ts))
- **`@Output` naming inconsistency**: renamed `onSubmit$` → `onSubmit` (with method renamed to `submitForm()` to avoid collision) ([`toolbox-form.component.ts`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.ts), [`toolbox-form.component.html`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.html), [`app.component.html`](projects/guitar-toolbox-lib/src/lib/app.component.html))

### Changed
- **Exported `API_BASE_URL`**: added injection token to public API surface ([`public-api.ts`](projects/guitar-toolbox-lib/src/public-api.ts))
- **Updated tests**: `api.service.spec.ts` now covers both default and custom `API_BASE_URL` scenarios

## [1.1.0] — 2026-07-01

### Fixed
- **Memory leak**: added `OnDestroy` with proper unsubscription from `valueChanges` in `ToolboxFormComponent` ([`toolbox-form.component.ts`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.ts))
- **Broken tests in `UICommands.spec.ts`**: rewrote spec to match current `NoteSelector` interface — removed imports of non-existent services, fixed constructor signatures, added tests for `DisplayCustomPatternCommand` ([`UICommands.spec.ts`](projects/guitar-toolbox-lib/src/lib/shared/UICommands.spec.ts))
- **Missing `HttpClientTestingModule`** in `ApiService` spec — added proper HTTP test setup with `HttpTestingController` ([`api.service.spec.ts`](projects/guitar-toolbox-lib/src/lib/api.service.spec.ts))
- **Incorrect component selector**: changed `app-custom-pattern` → `lib-custom-pattern` to avoid conflicts with consumer apps ([`custom-pattern.component.ts`](projects/guitar-toolbox-lib/src/lib/custom-pattern/custom-pattern.component.ts), [`toolbox-form.component.html`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.html))
- **Fixed `AppComponent` tests**: removed references to non-existent `title` property and wrong DOM queries ([`app.component.spec.ts`](projects/guitar-toolbox-lib/src/lib/app.component.spec.ts))
- **Fixed `ToolboxFormComponent` tests**: added missing `type` field in form submit expectations ([`toolbox-form.component.spec.ts`](projects/guitar-toolbox-lib/src/lib/toolbox-form/toolbox-form.component.spec.ts))

### Changed
- **Expanded public API**: added exports for `CustomPatternComponent`, `ApiService`, `ToolboxSearchQuery`, `QueryTypes`, `Command` types, all command classes, and `GuitarNeck` ([`public-api.ts`](projects/guitar-toolbox-lib/src/public-api.ts))
