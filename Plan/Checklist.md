# TimeLock Development Checklist

## 📋 Project Setup & Configuration

- [ ] Initialize Expo project with TypeScript
- [ ] Configure Expo Router for navigation
- [ ] Set up ESLint and Prettier
- [x] Install all required dependencies (see Library.md)
- [ ] Configure app.json for permissions (notifications, etc.)
- [ ] Set up development environment (iOS/Android simulators)

## 🗄️ Database & Data Layer

- [x] Create database schema file with table definitions
- [ ] Implement database connection and initialization
- [x] Create TypeScript interfaces and types (see Model.md)
- [ ] Implement TaskRepository with all CRUD operations
- [ ] Implement CategoryRepository with CRUD operations
- [ ] Implement SettingsRepository for app settings
- [ ] Add database migration system for future updates
- [ ] Create database seeding for initial data

## 🏗️ Core Architecture

- [ ] Set up folder structure (repositories, services, types, etc.)
- [x] Create constants file with predefined notification options
- [ ] Implement error handling utilities
- [ ] Create custom hooks for data fetching
- [ ] Set up global state management (Context API or Zustand)
- [ ] Implement theme system (light/dark mode)

## 📱 UI Components & Screens

### Core Screens
- [ ] Home/Dashboard screen with task overview
- [ ] Task list screen with filtering and sorting
- [ ] Task detail/create/edit screen
- [ ] Calendar view screen
- [ ] Category management screen
- [ ] Settings screen

### Reusable Components
- [ ] Task card component
- [ ] Category selector component
- [ ] Date/time picker component
- [ ] Notification settings component
- [ ] Countdown timer component
- [ ] Calendar component integration
- [ ] Empty state components

## ⏰ Notification System

- [ ] Request notification permissions on app start
- [ ] Implement local notification scheduling
- [ ] Create notification service for task reminders
- [ ] Handle notification taps to open relevant screens
- [ ] Implement notification settings management
- [ ] Add notification testing utilities

## 📅 Calendar Integration

- [ ] Integrate react-native-calendars
- [ ] Display tasks on calendar dates
- [ ] Implement calendar view navigation
- [ ] Add date selection for task creation
- [ ] Style calendar with task indicators
- [ ] Handle calendar events and interactions

## ⏳ Time Tracking Features

- [ ] Implement countdown timer component
- [ ] Add time remaining calculations
- [ ] Create progress indicators for tasks
- [ ] Implement time tracking utilities with date-fns
- [ ] Add visual feedback for urgent tasks

## 🎨 UI/UX Polish

- [ ] Implement consistent design system
- [ ] Add loading states and skeletons
- [ ] Implement pull-to-refresh functionality
- [ ] Add haptic feedback for interactions
- [ ] Create smooth animations and transitions
- [ ] Implement dark/light theme switching
- [ ] Add accessibility features (screen reader support)

## 🎛️ Theme & Settings

- [ ] Implement `ThemeProvider` (Context) to expose current theme and setter
- [ ] Create theme toggle UI in `Settings` (light / dark / system)
- [ ] Persist theme to `settings` table via `SettingsRepository` (`key='theme'`)
- [ ] Implement system theme detection and subscribe to changes
- [ ] Update core components to read colors from theme constants
- [ ] Add unit tests for `SettingsRepository` theme persistence
- [ ] E2E/manual test: switch themes, verify persistence and UI updates

## 🧪 Testing & Quality Assurance

- [ ] Set up Jest and React Native Testing Library
- [ ] Write unit tests for repository classes
- [ ] Write unit tests for utility functions
- [ ] Write integration tests for key user flows
- [ ] Test database operations
- [ ] Test notification functionality
- [ ] Manual testing on iOS and Android devices
- [ ] Performance testing and optimization

## 🚀 Advanced Features (Phase 2)

- [ ] Implement iOS Live Activities
- [ ] Add push notification support
- [ ] Implement task sharing/export
- [ ] Add recurring tasks feature
- [ ] Implement task templates
- [ ] Add task attachments/media support
- [ ] Implement cloud backup/sync

## 📦 Deployment & Distribution

- [ ] Configure EAS Build for iOS and Android
- [ ] Set up app icons and splash screens
- [ ] Configure app store metadata
- [ ] Test production builds
- [ ] Submit to App Store and Google Play
- [ ] Set up crash reporting (Sentry)
- [ ] Implement analytics (optional)

## � QR Code Task Sharing

- [x] Install QR code libraries (react-native-qrcode-svg, expo-barcode-scanner)
- [ ] Create QR code generation component for tasks
- [ ] Implement QR code data structure (task details without sensitive info)
- [ ] Add "Share via QR" option to task detail screen
- [ ] Create QR code scanner screen for importing tasks
- [ ] Implement task import from scanned QR code
- [ ] Add camera permissions for QR scanning
- [ ] Handle QR code validation and error cases
- [ ] Test QR code sharing between devices

## 🔧 Maintenance & Updates

- [ ] Monitor app performance and crashes
- [ ] Plan for future feature updates
- [ ] Maintain dependency updates
- [ ] Handle user feedback and bug reports
- [ ] Plan for data migration between app versions

---

## Progress Tracking

## Progress Tracking

- **Total Tasks:** 65+
- **Completed:** 5
- **In Progress:** 0
- **Remaining:** 60+

*Last Updated: January 13, 2026*
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/Plan/Checklist.md