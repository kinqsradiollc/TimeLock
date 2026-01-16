# Changelog 📝

All notable changes to TimeLock will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation suite in `docs/` directory
- Branching strategy guide (`BRANCHING.md`)
- Code style guide (`CODE_STYLE.md`)
- Contributing guidelines (`CONTRIBUTING.md`)
- Development workflow documentation (`DEVELOPMENT.md`)
- Shared style system (`styles/shared.ts`) with reusable patterns

### Changed
- Improved project structure with dedicated documentation branch
- Enhanced README with accurate feature descriptions
- Refactored all screen styles to use shared style patterns
- Reduced code duplication by ~60+ lines across style files

### Fixed
- Documentation now accurately reflects implemented features (calendar export, not bidirectional sync)
- Corrected feature claims to match actual codebase capabilities

## [1.0.0] - 2026-01-16

### Added
- **Calendar Export**: One-way export to device calendars with duplicate prevention
- **Task Management**: Complete CRUD operations for tasks with categories
- **UI Components**: Comprehensive component library with consistent styling
- **Database Layer**: Expo SQLite implementation with migration system
- **Navigation**: Expo Router-based navigation with tab structure
- **Styling System**: Organized style extraction with shared style patterns
- **TypeScript**: Full TypeScript implementation with strict type checking

### Features
- **Task Creation**: Add new tasks with titles, descriptions, categories, and priorities
- **Task Completion**: Mark tasks as complete with visual indicators
- **Calendar Export**: Export tasks to device calendar with duplicate prevention and ICS file export
- **Selective Export**: Choose specific tasks or export all tasks to calendar
- **Category Management**: Create and manage custom task categories with colors
- **Multiple Calendar Views**: Month, Week, and Agenda views for better task visualization
- **Settings Screen**: App configuration and theme preferences
- **Dark/Light Mode**: Theme support with system preference detection

### Technical Improvements
- **Code Organization**: Extracted all inline styles to dedicated files
- **Shared Style System**: Created reusable style patterns library for consistency
- **Component Architecture**: Modular component structure with proper separation
- **Error Handling**: Comprehensive error handling throughout the app
- **Performance**: Optimized rendering and reduced code duplication
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Documentation**: Comprehensive guides for development, branching, and contribution

### Dependencies
- **Expo SDK 54**: Latest Expo features and improvements
- **React Native**: Core mobile framework
- **Expo SQLite**: Local database with migration support
- **Expo Calendar**: Device calendar integration
- **Expo File System**: File operations and export functionality
- **TypeScript**: Type-safe development

---

## Version History

### Pre-1.0.0 (Development Phase)

#### Alpha Releases
- **0.1.0-alpha**: Initial project setup with basic task management
- **0.2.0-alpha**: Added calendar integration and export functionality
- **0.3.0-alpha**: Implemented category system and improved UI
- **0.4.0-alpha**: Added settings screen and notification permissions
- **0.5.0-alpha**: Code refactoring and style organization
- **0.6.0-alpha**: Documentation and branching strategy implementation

---

## Types of Changes

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

---

## Contributing to Changelog

When contributing to TimeLock, please:

1. **Add entries** to the "Unreleased" section above
2. **Categorize changes** appropriately (Added, Changed, Fixed, etc.)
3. **Be descriptive** but concise in change descriptions
4. **Reference issues** when applicable (e.g., "Fix calendar sync issue (#123)")
5. **Update version** and date when releasing

### Example Entries

```markdown
### Added
- New calendar export feature with duplicate prevention (#456)
- Category management system with color coding

### Fixed
- Timezone display issue in calendar headers (#789)
- Memory leak in task list rendering

### Changed
- Improved task completion animation performance
- Updated calendar permission request flow
```

---

## Release Process

### Version Numbering
We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Release Checklist
- [ ] Update version in `package.json`
- [ ] Update version in `app.json`
- [ ] Move unreleased changes to new version section
- [ ] Update release date
- [ ] Create git tag
- [ ] Create GitHub release
- [ ] Update documentation if needed
- [ ] Deploy to app stores

### Release Commands
```bash
# Update version
npm version patch  # or minor/major

# Create release commit and tag
git push --follow-tags origin main

# Create GitHub release
# Use the changelog content for release notes
```

---

## Future Releases

### Planned for v1.1.0
- [ ] Bidirectional calendar sync (import from device calendar)
- [ ] Push notifications for task reminders
- [ ] Task search and filtering
- [ ] Recurring tasks support

### Planned for v1.2.0
- [ ] Task templates for common workflows
- [ ] Data backup and restore
- [ ] Advanced statistics and insights
- [ ] Widget support (iOS/Android)

### Planned for v2.0.0
- [ ] Cloud sync across devices
- [ ] Collaboration and sharing features
- [ ] Multi-platform support (web, desktop)
- [ ] API for third-party integrations

---

**For the latest updates, check the [GitHub Releases](https://github.com/your-username/TimeLock/releases) page.**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/CHANGELOG.md