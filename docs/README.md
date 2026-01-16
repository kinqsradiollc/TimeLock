# TimeLock Documentation 📚

Welcome to the TimeLock documentation! This guide will help you understand the project structure, development workflow, and contribution guidelines.

## 📖 Documentation Index

### Getting Started
- **[Development Guide](DEVELOPMENT.md)** - Complete setup instructions, project structure, and development workflow
  - Prerequisites and installation
  - Running the app on different platforms
  - Development server and hot reload
  - Testing and debugging
  - Deployment process

### Development Guidelines
- **[Branching Strategy](BRANCHING.md)** - Git workflow and branch management
  - Branch types and naming conventions
  - Feature development workflow
  - Pull request process
  - Merge strategies and conflict resolution

- **[Code Style Guide](CODE_STYLE.md)** - Coding standards and best practices
  - TypeScript guidelines
  - React Native patterns
  - Style organization and shared patterns
  - File naming conventions
  - Code formatting rules

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to TimeLock
  - Finding issues to work on
  - Development workflow
  - Testing requirements
  - Pull request guidelines
  - Code review process

### Project Resources
- **[Main README](../README.md)** - Project overview and quick start
- **[Changelog](../CHANGELOG.md)** - Version history and release notes

## 🎯 Quick Links

### For New Contributors
1. Read the [Development Guide](DEVELOPMENT.md) to set up your environment
2. Review the [Code Style Guide](CODE_STYLE.md) to understand our standards
3. Check the [Contributing Guide](CONTRIBUTING.md) for the contribution workflow
4. Follow the [Branching Strategy](BRANCHING.md) when creating branches

### For Existing Contributors
- **Found a bug?** Check [Contributing Guide](CONTRIBUTING.md#reporting-issues) for reporting
- **Need to create a feature?** Follow [Branching Strategy](BRANCHING.md#feature-development)
- **Want to refactor code?** Review [Code Style Guide](CODE_STYLE.md) first
- **Ready to merge?** See [Branching Strategy](BRANCHING.md#pull-request-guidelines)

## 🏗️ Project Architecture

### Core Technologies
- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Expo SQLite** for local database
- **Expo Calendar** for calendar integration

### Code Organization
```
TimeLock/
├── app/              # Screens and navigation (Expo Router)
├── components/       # Reusable UI components
├── styles/          # Organized style system
│   ├── shared.ts    # Shared style patterns
│   ├── screens/     # Screen-specific styles
│   └── components/  # Component-specific styles
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
└── constants/       # App-wide constants
```

## 🎨 Style System

TimeLock uses a comprehensive shared style system:
- **Shared Patterns**: Reusable style patterns in `styles/shared.ts`
- **Screen Styles**: Dedicated files in `styles/screens/`
- **Component Styles**: Dedicated files in `styles/components/`
- **Constants**: Colors, spacing, and typography in separate files

See [Code Style Guide - Styling Organization](CODE_STYLE.md#styling-organization) for details.

## 🔄 Development Workflow

1. **Branch from `develop`** or `main` depending on the change type
2. **Follow naming conventions** from the branching strategy
3. **Write clean code** following the style guide
4. **Test thoroughly** on iOS and Android
5. **Create pull request** with clear description
6. **Address review feedback** and merge

## 📝 Documentation Updates

When making changes that affect documentation:
1. Update relevant guide files in `docs/`
2. Update main README.md if features change
3. Add entry to CHANGELOG.md
4. Ensure code examples are accurate
5. Test all documentation links

## 🤝 Getting Help

- **Questions about setup?** Check [Development Guide](DEVELOPMENT.md)
- **Confused about code style?** Review [Code Style Guide](CODE_STYLE.md)
- **Need contribution help?** See [Contributing Guide](CONTRIBUTING.md)
- **Git workflow questions?** Read [Branching Strategy](BRANCHING.md)

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**License**: MIT

See [Changelog](../CHANGELOG.md) for detailed version history.

---

**Happy coding! 🚀**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/README.md