# Development Guide 🚀

This guide covers everything you need to know to set up, develop, and contribute to the TimeLock project.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style & Organization](#code-style--organization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Expo CLI**: Latest version
- **Git**: Version 2.30 or higher

### Platform-Specific Requirements

#### iOS Development
- macOS 12.0 or later
- Xcode 14.0 or later
- iOS Simulator (comes with Xcode)
- CocoaPods (for iOS dependencies)

#### Android Development
- Android Studio Arctic Fox or later
- Android SDK API level 31 or higher
- Android Virtual Device (AVD) or physical device

#### Web Development
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional setup required

## Environment Setup

### 1. Clone the Repository

```bash
# Clone the main repository
git clone https://github.com/yourusername/TimeLock.git
cd TimeLock

# If working on a specific branch
git checkout branch-name
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# App Configuration
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_APP_OWNER=TimeLock Team
EXPO_PUBLIC_DB_VERSION=2

# Optional: Custom configuration
# EXPO_PUBLIC_API_URL=https://api.timelock.app
```

### 4. Start Development Server

```bash
# Start Expo development server
npm start

# Or with specific platform
npm run ios      # iOS only
npm run android  # Android only
npm run web      # Web only
```

### 5. Run on Device/Simulator

#### iOS
```bash
npm run ios
# Or press 'i' in Expo CLI
```

#### Android
```bash
npm run android
# Or press 'a' in Expo CLI
```

#### Web
```bash
npm run web
# Or press 'w' in Expo CLI
```

## Project Structure

```
TimeLock/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx         # Tab layout
│   │   ├── index.tsx           # Tasks screen
│   │   └── calendar.tsx        # Calendar screen
│   ├── task-form.tsx           # Task creation/editing
│   ├── task-detail.tsx         # Task details view
│   ├── category-manager.tsx    # Category management
│   ├── settings.tsx            # App settings
│   └── modal.tsx               # Modal screens
├── components/                  # Reusable components
│   ├── TaskCard.tsx            # Task list item
│   ├── PageHeader.tsx          # Page header with stats
│   ├── EmptyState.tsx          # Empty state component
│   └── NotificationPermissionModal.tsx
├── styles/                     # Style definitions
│   ├── screens/                # Screen-specific styles
│   │   ├── calendar.styles.ts
│   │   ├── tasks.styles.ts
│   │   └── ...
│   ├── components/             # Component-specific styles
│   │   ├── taskCard.styles.ts
│   │   └── ...
│   ├── common.ts               # Common styles and constants
│   ├── colors.ts               # Color definitions
│   ├── spacing.ts              # Spacing constants
│   └── typography.ts           # Typography constants
├── services/                   # Business logic services
│   ├── CalendarSyncService.ts  # Calendar integration
│   └── ...
├── repositories/               # Data access layer
│   ├── TaskRepository.ts
│   ├── CategoryRepository.ts
│   └── SettingsRepository.ts
├── types/                      # TypeScript type definitions
│   ├── task.ts
│   ├── category.ts
│   └── ...
├── hooks/                      # Custom React hooks
│   ├── useNotificationPermissions.ts
│   └── useTheme.ts
├── constants/                  # App constants
│   ├── notifications.ts
│   └── ...
├── database/                   # Database setup and migrations
│   ├── index.ts
│   └── migrations.ts
└── docs/                       # Documentation
    ├── DEVELOPMENT.md
    ├── BRANCHING.md
    └── ...
```

## Development Workflow

### 1. Choose Your Branch Strategy

See [Branching Strategy](BRANCHING.md) for detailed branching guidelines.

### 2. Create a Feature Branch

```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/issue-description

# For documentation
git checkout -b docs/update-guide

# For styling improvements
git checkout -b styling/component-improvements
```

### 3. Make Your Changes

Follow our [Code Style Guide](CODE_STYLE.md) for consistency.

### 4. Test Your Changes

```bash
# Run TypeScript checks
npm run type-check

# Run linting
npm run lint

# Test on multiple platforms
npm run ios
npm run android
npm run web
```

### 5. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add calendar export functionality

- Add selective export to device calendar
- Add duplicate prevention logic
- Update export messages with better UX
- Fix UTC timezone issues"

# For multiple commits on a feature
git add specific-file.ts
git commit -m "refactor: extract calendar styles to separate file"
```

### 6. Push and Create Pull Request

```bash
# Push your branch
git push -u origin your-branch-name

# Create pull request on GitHub
# - Go to repository on GitHub
# - Click "Compare & pull request"
# - Add description and link to issues
# - Request review from team members
```

### 7. Code Review Process

- **Reviewer** will review code for:
  - Code quality and style
  - Functionality
  - Performance
  - Security
  - Documentation

- **Address feedback** and update PR
- **Merge** when approved

## Code Style & Organization

### Style Organization

We follow a strict style organization pattern:

```typescript
// ❌ Bad: Inline styles
const styles = StyleSheet.create({
  container: { /* ... */ },
  // 50+ more styles...
});

// ✅ Good: Extracted styles
import { screenStyles as styles } from '@/styles/screens/screen.styles';
```

### File Structure for Styles

```
styles/
├── screens/          # Screen-specific styles
│   ├── calendar.styles.ts
│   ├── tasks.styles.ts
│   └── taskForm.styles.ts
├── components/       # Component-specific styles
│   ├── taskCard.styles.ts
│   └── pageHeader.styles.ts
├── common.ts         # Shared constants
├── colors.ts         # Color definitions
├── spacing.ts        # Spacing constants
└── typography.ts     # Typography constants
```

### Import Pattern

```typescript
// Screen component
import { screenStyles as styles } from '@/styles/screens/screen.styles';

// Component
import { componentStyles as styles } from '@/styles/components/component.styles';
```

## Testing

### Manual Testing Checklist

#### Core Functionality
- [ ] Task creation, editing, deletion
- [ ] Category management
- [ ] Calendar export (device + ICS)
- [ ] Calendar views (Month/Week/Agenda)
- [ ] Theme switching
- [ ] Notifications

#### UI/UX Testing
- [ ] Dark mode compatibility
- [ ] Responsive design
- [ ] Accessibility (screen readers)
- [ ] Performance on low-end devices
- [ ] Memory usage

#### Platform Testing
- [ ] iOS Simulator (multiple devices)
- [ ] Android Emulator (multiple devices)
- [ ] Physical devices (if available)
- [ ] Web browser compatibility

### Automated Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- TaskCard.test.tsx
```

## Deployment

### Build Commands

```bash
# Build for production
npm run build

# Build specific platforms
npx expo build:ios
npx expo build:android
```

### Release Process

1. **Update version** in `app.json` and `.env`
2. **Update changelog** in `CHANGELOG.md`
3. **Create release branch**
4. **Test build** on all platforms
5. **Create GitHub release**
6. **Submit to app stores**

### Environment Variables for Production

```env
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_APP_OWNER=TimeLock Team
EXPO_PUBLIC_DB_VERSION=2
EXPO_PUBLIC_ENVIRONMENT=production
```

## Troubleshooting

### Common Issues

#### Build Issues

**Problem**: `Metro bundler process exited`
```bash
# Clear cache and restart
npx expo start --clear
```

**Problem**: `Unable to resolve module`
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

#### iOS Issues

**Problem**: CocoaPods installation fails
```bash
# Update CocoaPods
sudo gem install cocoapods
cd ios && pod install
```

**Problem**: Simulator not found
```bash
# Check available simulators
xcrun simctl list devices

# Open Simulator app manually
open -a Simulator
```

#### Android Issues

**Problem**: Android SDK not found
```bash
# Check Android Studio SDK location
echo $ANDROID_HOME

# Set if missing
export ANDROID_HOME=/Users/$USER/Library/Android/sdk
```

**Problem**: Emulator not starting
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd emulator_name
```

#### Database Issues

**Problem**: Migration fails
```bash
# Reset database (development only)
# Delete database file and restart app
```

**Problem**: Calendar permissions denied
```bash
# Reset permissions in device settings
# Or reinstall app
```

### Getting Help

1. **Check existing issues** on GitHub
2. **Search documentation** in `docs/` folder
3. **Ask in discussions** or create new issue
4. **Check Expo documentation** for platform-specific issues

### Performance Tips

- **Use FlatList** for large lists instead of ScrollView
- **Memoize expensive calculations** with useMemo
- **Optimize images** and assets
- **Minimize bridge communication** between JS and native
- **Use Hermes engine** for better performance

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/routing/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Happy coding! 🎉**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/docs/DEVELOPMENT.md