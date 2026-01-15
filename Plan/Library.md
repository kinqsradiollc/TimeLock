# TimeLock App Libraries

This document outlines the libraries used in the TimeLock deadline management app and their purposes.

## Core Libraries

### expo-sqlite
- **Purpose**: Local SQL database for persistent data storage
- **Usage**: Store tasks, deadlines, user settings
- **Installation**: `npx expo install expo-sqlite`
- **Documentation**: [Expo SQLite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)

### expo-notifications
- **Purpose**: Handle push notifications and local notifications
- **Usage**: Send reminders for upcoming deadlines, task notifications
- **Installation**: `npx expo install expo-notifications`
- **Documentation**: [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)

### react-native-calendars
- **Purpose**: Calendar components for date selection and display
- **Usage**: Calendar view for deadlines, date picker for task creation
- **Installation**: `npx expo install react-native-calendars`
- **Documentation**: [React Native Calendars](https://github.com/wix/react-native-calendars)

### date-fns
- **Purpose**: Date manipulation and formatting utilities
- **Usage**: Calculate time remaining, format dates, date arithmetic
- **Installation**: `npx expo install date-fns`
- **Documentation**: [Date-fns Docs](https://date-fns.org/)

### expo-live-activities
- **Purpose**: iOS Live Activities for dynamic lock screen updates
- **Usage**: Show countdown timers and task progress on lock screen
- **Installation**: `npx expo install expo-live-activities`
- **Documentation**: [Expo Live Activities](https://docs.expo.dev/versions/latest/sdk/live-activities/)

### react-native-countdown-circle-timer
- **Purpose**: Animated countdown timer components
- **Usage**: Visual countdown for time remaining on tasks
- **Installation**: `npx expo install react-native-countdown-circle-timer`
- **Documentation**: [Countdown Circle Timer](https://github.com/vydimitrov/react-native-countdown-circle-timer)

### react-native-qrcode-svg
- **Purpose**: Generate QR codes for task sharing
- **Usage**: Create scannable QR codes containing task data
- **Installation**: `npx expo install react-native-qrcode-svg`
- **Documentation**: [QR Code SVG](https://github.com/awesomejerry/react-native-qrcode-svg)

### expo-barcode-scanner
- **Purpose**: Scan QR codes to import shared tasks
- **Usage**: Camera-based QR code scanning for task import
- **Installation**: `npx expo install expo-barcode-scanner`
- **Documentation**: [Expo Barcode Scanner](https://docs.expo.dev/versions/latest/sdk/barcode-scanner/)

## Existing Expo Libraries (Already Included)

- **expo-router**: File-based routing
- **expo-haptics**: Haptic feedback
- **@expo/vector-icons**: Icon library
- **react-native-reanimated**: Animations
- **expo-image**: Image handling</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/Plan/Library.md