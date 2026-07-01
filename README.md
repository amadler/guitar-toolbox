# GuitarToolbox

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Library Package

This project includes the `guitar-toolbox-lib` Angular library under [`projects/guitar-toolbox-lib/`](projects/guitar-toolbox-lib/).

### Build

Run `ng build guitar-toolbox-lib` to compile the library. Production build artifacts are output to [`dist/guitar-toolbox-lib/`](dist/guitar-toolbox-lib/).

### Running unit tests

Run `ng test guitar-toolbox-lib` to execute the library's unit tests via [Karma](https://karma-runner.github.io).

### Publishing to npm

1. Update the version in [`projects/guitar-toolbox-lib/package.json`](projects/guitar-toolbox-lib/package.json)
2. Add a changelog entry in [`projects/guitar-toolbox-lib/CHANGELOG.md`](projects/guitar-toolbox-lib/CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions
3. Build the library: `ng build guitar-toolbox-lib`
4. Navigate to the output directory: `cd dist/guitar-toolbox-lib`
5. Publish: `npm publish`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
