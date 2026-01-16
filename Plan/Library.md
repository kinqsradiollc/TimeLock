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

### expo-notifications 📦
- **Status**: Installed, permissions UI ready, scheduling not yet implemented
- **Purpose**: Handle push notifications and local notifications
- **Usage**: Send reminders for upcoming deadlines, task notifications
- **Installation**: `npx expo install expo-notifications`
- **Documentation**: [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- **Next Steps**: Implement notification scheduling service

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

### react-native-countdown-circle-timer 📦
- **Status**: Installed but not yet implemented
- **Purpose**: Animated countdown timer components
- **Usage**: Visual countdown for time remaining on tasks
- **Installation**: `npx expo install react-native-countdown-circle-timer`
- **Documentation**: [Countdown Circle Timer](https://github.com/vydimitrov/react-native-countdown-circle-timer)
- **Note**: Planned for time tracking feature (Phase 3)

### react-native-qrcode-svg 📦
- **Status**: Installed but not yet implemented
- **Purpose**: Generate QR codes for task sharing
- **Usage**: Create scannable QR codes containing task data
- **Installation**: `npx expo install react-native-qrcode-svg`
- **Documentation**: [QR Code SVG](https://github.com/awesomejerry/react-native-qrcode-svg)
- **Note**: Planned for Phase 6 (Advanced Features)

### expo-barcode-scanner 📦
- **Status**: Installed but not yet implemented
- **Purpose**: Scan QR codes to import shared tasks
- **Usage**: Camera-based QR code scanning for task import
- **Installation**: `npx expo install expo-barcode-scanner`
- **Documentation**: [Expo Barcode Scanner](https://docs.expo.dev/versions/latest/sdk/barcode-scanner/)
- **Note**: Planned for Phase 6 (Advanced Features)

## Additional Expo Libraries ✅

- **expo-router**: File-based routing (fully implemented)
- **expo-haptics**: Haptic feedback (implemented for tab navigation)
- **@expo/vector-icons**: Icon library (used throughout UI)
- **react-native-reanimated**: Animations (ready for use)
- **expo-image**: Image handling (available)
- **expo-calendar**: Device calendar integration (fully implemented for one-way export)
- **expo-file-system**: File operations (used for ICS export)
- **@react-native-community/datetimepicker**: Date/time selection (fully implemented)
- **react-native-svg**: SVG support (required for QR codes and icons)

## v1.0.0 Summary

**Fully Implemented (6 libraries):**
- expo-sqlite (database layer)
- react-native-calendars (calendar views)
- date-fns (date utilities)
- expo-calendar (calendar export)
- expo-file-system (ICS export)
- @react-native-community/datetimepicker (date/time picker)

**Installed, Not Yet Implemented (5 libraries):**
- expo-notifications (permissions UI only)
- expo-live-activities (experimental)
- react-native-countdown-circle-timer (pending Phase 3)
- react-native-qrcode-svg (pending Phase 6)
- expo-barcode-scanner (pending Phase 6)</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/Plan/Library.md