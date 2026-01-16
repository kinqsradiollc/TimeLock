# Changelog 📝

All notable changes to TimeLock will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Current Status: Development Build v1.0.0

**Note**: This is an open-source project currently in active development. The app is NOT yet released on the App Store or Google Play Store. This version represents the initial development milestone with core functionality implemented.

### ✅ Implemented Features (v1.0.0)

#### Task Management
- Create, edit, and delete tasks with titles, descriptions, and deadlines
- Mark tasks as complete/incomplete with visual indicators
- Priority levels: low, medium, high, urgent
- User-created categories with custom colors
- Category management (create, edit, delete)
- Task detail view with full information

#### Calendar Integration
- Calendar export: One-way export to device calendars
- Duplicate prevention for calendar exports
- ICS file export functionality
- Multiple calendar views: Month, Week, and Agenda
- Visual indicators for tasks on calendar dates
- Date picker for deadline selection
- Calendar permissions management

#### User Interface
- Clean, intuitive interface with consistent design
- Tab-based navigation (Home, Tasks, Calendar, Explore)
- Task list with filtering and sorting
- Empty state components
- Dark/Light/System theme support with persistence
- **Comprehensive haptic feedback system**
  - Seven feedback types: light, medium, heavy, success, warning, error, selection
  - User toggle in Settings to enable/disable
  - Applied to all interactive elements: navigation, buttons, forms, pickers, CRUD operations
  - Platform-aware (iOS/Android only)
  - Real-time setting checks for immediate response
- **Real-time countdown timers and progress tracking**
  - Live countdown updates (1-second intervals)
  - Circular progress indicators showing time elapsed
  - Urgent visual indicators (flame icon for <24hrs)
  - Dynamic color coding (Blue → Amber → Orange → Red)
  - Comprehensive time tracking utilities
- Shared style system with 40+ reusable patterns

#### Data & Storage
- Expo SQLite database with migration system
- Repository pattern for data access (TaskRepository, CategoryRepository, SettingsRepository)
- Complete CRUD operations for all entities
- Type-safe data models with TypeScript interfaces
- Settings persistence (theme, permissions)

#### Technical Stack
- React Native 0.81.5
- Expo SDK 54
- TypeScript with strict type checking
- Expo Router for file-based navigation
- Context API for state management
- Modular component architecture

#### Documentation
- Comprehensive documentation suite in `docs/` directory
- Branching strategy guide (`BRANCHING.md`)
- Code style guide with design principles (`CODE_STYLE.md`)
- Contributing guidelines with feature request lifecycle (`CONTRIBUTING.md`)
- Development workflow documentation (`DEVELOPMENT.md`)
- Project planning documents in `Plan/` directory

### 🔄 Partially Implemented
- Notification system (permissions UI ready, scheduling not implemented)
- QR code task sharing (libraries installed, implementation pending)

### ❌ Planned for Future Development
- Local push notifications for task reminders
- Time tracking with countdown timers
- Bidirectional calendar sync (import from device calendar)
- iOS Live Activities for lock screen widgets
- Task search and advanced filtering
- Recurring tasks support
- Data backup and restore
- Cloud sync across devices

---

### Fixed
- Improved toggle switch contrast in Settings for light theme (thumb now white when off, track uses medium gray).
- Calendar month view now re-renders correctly when switching themes.
- Database migrations now idempotent - safe to re-run without duplicate column/setting errors.
- Database migrations now idempotent - safe to re-run without duplicate column/setting errors.

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
- [ ] Deploy to app stores (when ready)

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

## Contributing to the Project

This is an **open-source project** and we welcome contributions! Whether you want to:
- 🐛 Fix bugs
- ✨ Add new features
- 📚 Improve documentation
- 🧪 Write tests
- 🎨 Enhance UI/UX

Please read our [Contributing Guide](docs/CONTRIBUTING.md) to get started.

### How to Suggest Features

Check the [GitHub Issues](https://github.com/kinqsradiollc/TimeLock/issues) page for:
- Current feature requests and discussions
- Bugs and issues that need fixing
- Good first issues for new contributors

To suggest a new feature, open an issue using the feature request template.

---

## Future App Store Release

This app is planned for eventual release on the App Store and Google Play Store. The timeline for public release will be announced when the following criteria are met:

### Pre-Release Checklist
- [ ] Complete remaining Phase 4: Notifications implementation
- [ ] Implement Phase 3: Time Tracking features
- [ ] Comprehensive testing on multiple devices
- [ ] Add accessibility features (screen reader support)
- [ ] Performance optimization and bug fixes
- [ ] App store assets (icons, screenshots, descriptions)
- [ ] Privacy policy and terms of service
- [ ] Beta testing with real users

**Current Development Phase**: Building core features and establishing project foundation.

---

**For the latest development updates, check the [GitHub repository](https://github.com/kinqsradiollc/TimeLock).**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/CHANGELOG.md