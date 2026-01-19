# Changelog 📝

All notable changes to TimeLock will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Current Status: Open Source Template v1.0.0

**Note**: TimeLock is an open-source React Native project designed as a template for task management applications. This project will NOT be released on the App Store or Google Play Store. Instead, it serves as a comprehensive foundation that developers can fork, customize, and deploy as their own applications.

### 🎯 Project Purpose
- **Template Project**: Complete, production-ready codebase for task management apps
- **Open Source**: Free for anyone to use, modify, and distribute
- **Community Driven**: Accept contributions and feature requests
- **Self-Hosting**: Users can build and deploy their own versions
- **Learning Resource**: Educational example of modern React Native development

### ✅ Complete Feature Set (v1.0.0)

### ✅ Implemented Features (v1.0.0)

#### Task Management
- Create, edit, and delete tasks with titles, descriptions, and deadlines
- Mark tasks as complete/incomplete with visual indicators
- Priority levels: low, medium, high, urgent
- User-created categories with custom colors
- Category management (create, edit, delete)
- Task detail view with full information

#### QR Code Task Sharing
- Generate QR codes for individual tasks (QRCodeModal component)
- Share tasks via QR codes containing task details (title, description, deadline, priority)
- Scan QR codes to import shared tasks (scan-qr.tsx screen with camera permissions)
- Task import validation and error handling (invalid QR codes, duplicate prevention)
- White QR code pattern on black background for better visibility
- Processing flag to prevent multiple scans from single QR code
- Camera permission handling with user-friendly prompts

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
- None (all planned features completed)

### ✨ Added
- **iOS Live Activities**: Lock screen widgets with countdown timers
  - LiveActivitiesService for managing activity lifecycle (start, update, end)
  - Automatic integration with TaskRepository (create, update, delete, complete)
  - Database migration v5 for live_activity_id tracking
  - Native iOS widget with expo-live-activity plugin
  - Lock screen display with countdown timer and progress bar
  - Dynamic Island support for iPhone 14 Pro+ (compact, expanded, minimal views)
  - Priority emojis (🟢🟡🟠🔴) and urgency indicators (⚠️ Critical, ⏰ Urgent)
  - Platform-aware checks (iOS only, requires iOS 16.1+)
  - Styling with dark theme colors and circular timer
  - Auto-generated widget in ios/LiveActivity/ directory
  - Comprehensive setup guide in docs/LIVE_ACTIVITIES_SETUP.md
- **Complete Notification System**: Fully integrated task reminder system
  - NotificationService with scheduling, cancellation, and rescheduling APIs
  - TaskRepository integration - automatic scheduling on task creation
  - Automatic rescheduling when deadline or reminders change
  - Automatic cancellation when tasks completed or deleted
  - Support for multiple reminders per task (e.g., 1 week + 1 day + 1 hour before)
  - **Rich notification format**: Title shows task name, body includes priority emoji (🟢🟡🟠🔴), deadline date/time, and time remaining
  - **Notification tap handler**: Deep links to task detail screen when notification is tapped
  - Default notification preferences in Settings (applied to new tasks)
  - Per-task notification customization in task form
  - Notification ID tracking in database for cleanup
  - Foreground notification support with alerts, sound, and badges
  - Permission request flow with NotificationPermissionModal
  - Platform-aware (iOS/Android only, web not supported)
  - Android notification channel: 'task-reminders' with HIGH importance
- **Database Migration v4**: Added `notification_ids` column to tasks table for tracking scheduled notifications
- **Settings UI**: Multi-select notification preferences with 10 time options (1 minute to 2 weeks)
- **Task Form UI**: Reminders section with modal for selecting notification times
- **Home Page**: Live time display in greeting (e.g., "Good Morning • 9:45 AM")

### 🔧 Changed
- Removed expo-barcode-scanner plugin to fix iOS build issues
- Changed iOS/Android run scripts from `expo start` to `expo run:ios/android`
- Removed android.permission.CAMERA (not needed yet)
- Replaced react-native-vision-camera with expo-camera for better Expo Go compatibility

### ❌ Planned for Future Development
- Badge count management for pending tasks
- Bidirectional calendar sync (import from device calendar)
- Recurring tasks support
- Task search and advanced filtering
- Data backup and restore
- Cloud sync across devices
- Push notification updates for Live Activities via APNs
- Interactive Live Activity buttons (mark complete from lock screen)

---

### 🔧 Fixed
- Improved toggle switch contrast in Settings for light theme (thumb now white when off, track uses medium gray)
- Calendar month view now re-renders correctly when switching themes
- Database migrations now idempotent - safe to re-run without duplicate column/setting errors
- iOS build issues with expo-barcode-scanner module conflicts
- Notification API compatibility (singular cancelScheduledNotificationAsync with loop)
- Notification trigger type specification for proper scheduling

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

## Open Source Template Project

TimeLock is designed as an **open-source template** for React Native task management applications. This means:

### 🎯 What This Project Is
- **Complete Codebase**: Production-ready React Native app with full feature set
- **Educational Resource**: Learn modern React Native development patterns
- **Community Project**: Accept contributions from developers worldwide
- **Template Foundation**: Fork and customize for your own task management needs
- **Self-Hosting**: Users can build and deploy their own versions

### 🚫 What This Project Is NOT
- **App Store Release**: Will never be published on iOS App Store or Google Play
- **Commercial Product**: Not a monetized application
- **Closed Source**: Always open source and free

### 🔄 How to Use This Template

#### For Personal Use
```bash
# Fork the repository
git clone https://github.com/your-username/TimeLock.git
cd TimeLock

# Customize branding, colors, features
# Modify package.json, app.json
# Add your own features or remove unwanted ones

# Build for your devices
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

#### For Learning
- Study the architecture and patterns
- Learn Expo Router navigation
- Understand SQLite integration
- Explore notification systems
- Review testing approaches

#### For Contributing
- Report bugs via GitHub Issues
- Suggest features via GitHub Discussions
- Submit pull requests for improvements
- Help maintain documentation

### 📱 Building Your Own Version

#### Customization Steps
1. **Fork the repository**
2. **Update branding** in `app.json` and assets
3. **Modify colors** in `styles/colors.ts`
4. **Add/remove features** as needed
5. **Update package.json** with your app details
6. **Build and test** on target platforms
7. **Deploy** to app stores if desired

#### Required Changes for App Store
```json
// app.json
{
  "expo": {
    "name": "YourAppName",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "icon": "./assets/your-icon.png",
    "splash": {
      "image": "./assets/your-splash.png"
    }
  }
}
```

### 🤝 Community Guidelines

#### Contributing
- **Anyone can contribute** - no permission needed
- **All contributions welcome** - bugs, features, docs, tests
- **Follow existing patterns** - maintain code quality
- **Respect the community** - be constructive and helpful

#### Feature Requests
- Use [GitHub Discussions](https://github.com/kinqsradiollc/TimeLock/discussions) for ideas
- Community votes help prioritize features
- Contributors implement approved features

#### Issue Reporting
- Use [GitHub Issues](https://github.com/kinqsradiollc/TimeLock/issues) for bugs
- Provide clear reproduction steps
- Include environment details
- Check existing issues first

### 📊 Project Statistics
- **Status**: Complete and stable
- **License**: MIT (free for all uses)
- **Platform**: iOS, Android, Web
- **Framework**: React Native + Expo
- **Database**: SQLite
- **State**: Production-ready template

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

**For the latest development updates, check the [GitHub repository](https://github.com/kinqsradiollc/TimeLock).**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/CHANGELOG.md