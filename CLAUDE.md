# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cupertino Panes is a TypeScript library that creates multi-functional modals, cards, and panes with touch technologies. It provides native iOS-style behaviors and animations for web applications.

## Development Commands

### Build and Development
- `npm run build` - Production build (creates minified bundles in `/dist`)
- `npm run serve` - Development server with live reload on port 3000
- `npm run tslint` - Run TSLint for code quality checks
- `npm run changelog` - Generate changelog using conventional commits

### Testing Environment
- Use `npm run serve` to test changes in the `/playground` directory
- Visit `http://localhost:3000/playground/` to view examples
- Multiple demo pages available in `/playground` for testing different features

## Code Architecture

### Core Structure
- **Main Class**: `CupertinoPane` in `/src/cupertino-pane.ts` - Primary API class
- **Settings**: Configuration managed through `/src/settings.ts` with TypeScript interfaces in `/src/models.ts`
- **Module System**: Modular architecture with feature modules in `/src/modules/`

### Key Components
- **Breakpoints**: `/src/breakpoints.ts` - Manages pane positioning and snapping points
- **Transitions**: `/src/transitions.ts` - Handles animations and state transitions
- **Events**: `/src/events/` - Touch events, keyboard events, and resize handling
- **Device Detection**: `/src/device.ts` - Platform-specific optimizations
- **Support Detection**: `/src/support.ts` - Feature detection utilities

### Module System
Available modules (all in `/src/modules/`):
- `backdrop.ts` - Backdrop overlay functionality
- `fit-height.ts` - Auto-height calculation
- `follower.ts` - Element following behavior
- `horizontal.ts` - Horizontal pane orientation
- `inverse.ts` - Inverse animation direction
- `modal.ts` - Modal-specific features
- `z-stack.ts` - Stacking multiple panes

Each module can be enabled/disabled through the `modules` configuration option.

### Build System
- Uses Gulp for build orchestration (`/gulp/gulpfile.js`)
- TypeScript compilation with Rollup bundling
- Outputs multiple formats: UMD, ESM, and TypeScript declarations
- Development server with live reload capability

### Configuration
- **tsconfig.json**: TypeScript compilation targets ES2015 with ES2020 modules
- **tslint.json**: Strict linting rules following Airbnb-style conventions
- **package.json**: Defines browser support (Android 7+, iOS 11+, Safari 11+)

## Key Files to Understand
- `/src/cupertino-pane.ts` - Main API implementation
- `/src/settings.ts` - Default configuration
- `/src/models.ts` - TypeScript interfaces and type definitions
- `/src/events/events.ts` - Core touch and gesture handling
- `/playground/` - Example implementations for testing

## Development Guidelines
- Follow existing TypeScript patterns and interfaces
- Test changes using the playground environment
- Maintain iOS-native behavior patterns
- Consider cross-platform compatibility (specified in browserslist)
- Use the modular architecture for new features