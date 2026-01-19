# TimeLock App Libraries

This document outlines the libraries used in the TimeLock deadline management app and their purposes.

**Status Indicators:**
- ✅ Installed and actively used in v1.0.0
- 📦 Installed but not yet implemented
- ❌ Planned for future releases

## Core Libraries

### expo-sqlite ✅
- **Status**: Installed and implemented
- **Purpose**: Local SQL database for persistent data storage
- **Usage**: Store tasks, deadlines, user settings with migration system
- **Installation**: `npx expo install expo-sqlite`
- **Documentation**: [Expo SQLite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Implementation**: TaskRepository, CategoryRepository, SettingsRepository with full CRUD operations

### expo-notifications ✅
- **Status**: Installed and fully implemented
- **Purpose**: Handle push notifications and local notifications
- **Usage**: Send reminders for upcoming deadlines, task notifications with rich formatting
- **Installation**: `npx expo install expo-notifications`
- **Documentation**: [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- **Implementation**: Complete NotificationService with scheduling, cancellation, rescheduling, deep linking, and rich notification formatting with priority emoji and deadline details

### react-native-calendars ✅
- **Status**: Installed and fully implemented
- **Purpose**: Calendar components for date selection and display
- **Usage**: Calendar view for deadlines with Month/Week/Agenda views, date picker for task creation
- **Installation**: `npx expo install react-native-calendars`
- **Documentation**: [React Native Calendars](https://github.com/wix/react-native-calendars)
- **Implementation**: Full calendar integration with marked dates, task indicators, and view switching

### date-fns ✅
- **Status**: Installed and actively used
- **Purpose**: Date manipulation and formatting utilities
- **Usage**: Format dates, date arithmetic for task deadlines and calendar views
- **Installation**: `npx expo install date-fns`
- **Documentation**: [Date-fns Docs](https://date-fns.org/)
- **Implementation**: Used throughout app for date formatting and calculations

### expo-live-activities 📦
- **Status**: Installed but not yet implemented (version 0.0.0 - experimental)
- **Purpose**: iOS Live Activities for dynamic lock screen updates
- **Usage**: Show countdown timers and task progress on lock screen
- **Installation**: `npx expo install expo-live-activities`
- **Documentation**: [Expo Live Activities](https://docs.expo.dev/versions/latest/sdk/live-activities/)
- **Note**: Planned for future release (v1.1.0+)

### react-native-countdown-circle-timer ✅
- **Status**: Installed and fully implemented
- **Purpose**: Animated countdown timer components
- **Usage**: Visual countdown for time remaining on tasks with real-time updates
- **Installation**: `npx expo install react-native-countdown-circle-timer`
- **Documentation**: [Countdown Circle Timer](https://github.com/vydimitrov/react-native-countdown-circle-timer)
- **Implementation**: Circular progress indicators with dynamic color coding, urgent badges, and 1-second interval updates

### react-native-qrcode-svg ✅
- **Status**: Installed and fully implemented
- **Purpose**: Generate QR codes for task sharing
- **Usage**: Create scannable QR codes containing task data for cross-device sharing
- **Installation**: `npx expo install react-native-qrcode-svg`
- **Documentation**: [QR Code SVG](https://github.com/awesomejerry/react-native-qrcode-svg)
- **Implementation**: QRCodeModal component displays task QR codes for sharing

### expo-camera ✅
- **Status**: Installed and fully implemented
- **Purpose**: Camera handling for QR code scanning
- **Usage**: Camera-based QR code scanning for task import between devices
- **Installation**: `npx expo install expo-camera`
- **Documentation**: [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- **Implementation**: Complete QR code scanner with permission handling and task import functionality. Expo Go compatible.

## Additional Expo Libraries ✅

- **expo-router**: File-based routing (fully implemented)
- **expo-haptics**: Haptic feedback (fully implemented with 7 feedback types, Settings toggle, applied throughout entire app)
- **@expo/vector-icons**: Icon library (used throughout UI)
- **react-native-reanimated**: Animations (ready for use)
- **expo-image**: Image handling (available)
- **expo-calendar**: Device calendar integration (fully implemented for one-way export)
- **expo-file-system**: File operations (used for ICS export)
- **@react-native-community/datetimepicker**: Date/time selection (fully implemented)
- **react-native-svg**: SVG support (required for QR codes and icons)

## v1.0.0 Summary

**Fully Implemented (12 libraries):**
- expo-sqlite (database layer with migrations)
- react-native-calendars (calendar views with Month/Week/Agenda)
- date-fns (date utilities and formatting)
- expo-calendar (one-way calendar export)
- expo-file-system (ICS file export)
- @react-native-community/datetimepicker (date/time picker)
- expo-notifications (complete notification system with deep linking)
- react-native-countdown-circle-timer (real-time countdown timers)
- expo-haptics (comprehensive haptic feedback system)
- react-native-svg (SVG support for icons and graphics)
- react-native-qrcode-svg (QR code generation for task sharing)
- expo-camera (QR code scanning for task import)

**Installed, Not Yet Implemented (1 library):**
- expo-live-activities (experimental, planned for future iOS features)

**Removed Libraries:**
- expo-barcode-scanner (deprecated, replaced by expo-camera for better Expo Go compatibility)
- react-native-vision-camera (not Expo Go compatible, replaced by expo-camera)</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/Plan/Library.md