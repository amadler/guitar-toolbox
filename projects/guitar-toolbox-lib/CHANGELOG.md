# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-01

### Fixed

- **Memory leak**: added `OnDestroy` with proper unsubscription from `valueChanges` in `ToolboxFormComponent` ([`toolbox-form.component.ts`](src/lib/toolbox-form/toolbox-form.component.ts))
- **Broken tests in `UICommands.spec.ts`**: rewrote spec to match current `NoteSelector` interface — removed imports of non-existent services, fixed constructor signatures, added tests for `DisplayCustomPatternCommand` ([`UICommands.spec.ts`](src/lib/shared/UICommands.spec.ts))
- **Missing `HttpClientTestingModule`** in `ApiService` spec — added proper HTTP test setup with `HttpTestingController` ([`api.service.spec.ts`](src/lib/api.service.spec.ts))
- **Incorrect component selector**: changed `app-custom-pattern` → `lib-custom-pattern` to avoid conflicts with consumer apps ([`custom-pattern.component.ts`](src/lib/custom-pattern/custom-pattern.component.ts), [`toolbox-form.component.html`](src/lib/toolbox-form/toolbox-form.component.html))
- **Fixed `AppComponent` tests**: removed references to non-existent `title` property and wrong DOM queries ([`app.component.spec.ts`](src/lib/app.component.spec.ts))
- **Fixed `ToolboxFormComponent` tests**: added missing `type` field in form submit expectations ([`toolbox-form.component.spec.ts`](src/lib/toolbox-form/toolbox-form.component.spec.ts))

### Changed

- **Expanded public API**: added exports for `CustomPatternComponent`, `ApiService`, `ToolboxSearchQuery`, `QueryTypes`, `Command` types, all command classes, and `GuitarNeck` ([`public-api.ts`](src/public-api.ts))

### Backlog

Contract-changing items moved to [`BACKLOG.md`](../../BACKLOG.md):
- Extend `ToolboxSearchQuery.musicElements` to accept `string | number[]`
- Make API URL configurable via `InjectionToken`
- Rename `onSubmit$` → `onSubmit` for consistency
