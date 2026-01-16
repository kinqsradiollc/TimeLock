# TimeLock 📱⏰

A modern, feature-rich task management app built with React Native and Expo. Stay organized, meet deadlines, and never miss a task again!

## ✨ Features

- **📋 Task Management**: Create, edit, and organize tasks with priorities and categories
- **⏱️ Real-Time Countdown**: Live countdown timers with visual urgency indicators
- **🔔 Smart Notifications**: Customizable task reminders with multiple notification times
- **�📅 Calendar Export**: Export tasks to device calendar with duplicate prevention
- **🎨 Multiple Views**: Month, Week, and Agenda calendar views
- **🌙 Dark Mode**: Beautiful dark and light themes
- **📳 Haptic Feedback**: Comprehensive haptic responses for all interactions with user toggle
- **📊 Task Organization**: Tasks with priorities, categories, and deadlines
- **🏷️ Categories**: Organize tasks with custom categories and colors
- **🔄 Selective Export**: Choose specific tasks or export all to calendar
- **📱 Cross-Platform**: Works on iOS and Android

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/kinqsradiollc/TimeLock.git
cd TimeLock

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## 📁 Project Structure

```
TimeLock/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab-based navigation
│   ├── task-form.tsx      # Task creation/editing
│   ├── task-detail.tsx    # Task details view
│   ├── category-manager.tsx # Category management
│   ├── settings.tsx       # App settings
│   └── modal.tsx          # Modal screens
├── components/            # Reusable components
│   ├── TaskCard.tsx      # Task list item
│   ├── PageHeader.tsx    # Page header with stats
│   ├── EmptyState.tsx    # Empty state component
│   └── NotificationPermissionModal.tsx
├── styles/               # Style definitions
│   ├── screens/          # Screen-specific styles
│   ├── components/       # Component-specific styles
│   ├── common.ts         # Common styles and constants
│   ├── colors.ts         # Color definitions
│   ├── spacing.ts        # Spacing constants
│   └── typography.ts     # Typography constants
├── services/             # Business logic services
│   ├── CalendarSyncService.ts # Calendar integration
│   └── ...
├── repositories/         # Data access layer
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
├── constants/           # App constants
├── hooks/               # Custom React hooks
│   ├── useHaptics.ts   # Haptic feedback hook
│   └── ...
└── docs/                # Documentation
```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **Database**: Expo SQLite with migrations
- **Calendar**: Expo Calendar API
- **File System**: Expo File System (new API)
- **Styling**: React Native StyleSheet with organized structure
- **Icons**: Ionicons via @expo/vector-icons
- **Date Handling**: date-fns for formatting
- **State Management**: React hooks + Context API

## 📖 Documentation

- [Development Guide](docs/DEVELOPMENT.md) - Setup and development workflow
- [Branching Strategy](docs/BRANCHING.md) - Git branching and workflow
- [Code Style Guide](docs/CODE_STYLE.md) - Code organization and standards
- [Contributing](docs/CONTRIBUTING.md) - How to contribute to the project

## 🎯 Recent Updates

### v1.0.0 (Current)
- ✅ Complete styling system refactoring with shared patterns
- ✅ Real-time countdown timers with visual urgency indicators
- ✅ Comprehensive haptic feedback system with 7 feedback types
- ✅ Calendar export with duplicate prevention
- ✅ Multiple calendar views (Month/Week/Agenda)
- ✅ ICS file export functionality
- ✅ Enhanced export messages and user feedback
- ✅ Local time handling (fixed UTC timezone issues)
- ✅ Live date/time display in calendar header
- ✅ Comprehensive documentation suite
- ✅ Organized style architecture with reusable patterns
- ✅ UI fixes: improved toggle switch contrast and calendar theme rendering
- ✅ Database migrations now idempotent and safe to re-run


### Key Features Implemented
- **Calendar Export**: One-way export to device calendars (iOS Calendar, Google Calendar)
- **Selective Export**: Choose which tasks to export to calendar
- **Duplicate Prevention**: Prevents re-exporting already synced tasks
- **Time Tracking**: Real-time countdown timers with circular progress indicators and urgent visual feedback
- **Notification Service**: Customizable task reminders with multiple notification times (1 minute to 2 weeks before deadline)
- **Haptic Feedback**: 7 feedback types (light, medium, heavy, success, warning, error, selection) with Settings toggle
- **Category System**: Color-coded task organization
- **Multiple Calendar Views**: Month, Week, and Agenda views
- **Theme Support**: Light/dark mode with system preference detection
- **Shared Style System**: Reusable style patterns for consistent UI

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Workflow

1. **Create a feature branch** from `main`
2. **Make your changes** following our code style
3. **Test thoroughly** on multiple devices
4. **Create a pull request** with detailed description
5. **Code review** and merge

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using React Native and Expo
- Icons by Ionicons
- Calendar integration powered by Expo Calendar API

---

**Made with ❤️ by KINQS**