# TimeLock 📱⏰

A modern, feature-rich task management app built with React Native and Expo. Stay organized, meet deadlines, and never miss a task again!

## ✨ Features

- **📋 Task Management**: Create, edit, and organize tasks with priorities and categories
- **📅 Calendar Integration**: Sync tasks with device calendar (iOS Calendar, Google Calendar)
- **🔔 Smart Notifications**: Get timely reminders for upcoming deadlines
- **🎨 Multiple Views**: Month, Week, and Agenda calendar views
- **🌙 Dark Mode**: Beautiful dark and light themes
- **📊 Progress Tracking**: Visual progress indicators for task completion
- **🏷️ Categories**: Organize tasks with custom categories and colors
- **🔄 Selective Export**: Export specific tasks or all tasks to calendar
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
git clone https://github.com/yourusername/TimeLock.git
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

- [Development Guide](DEVELOPMENT.md) - Setup and development workflow
- [Branching Strategy](BRANCHING.md) - Git branching and workflow
- [Code Style Guide](CODE_STYLE.md) - Code organization and standards
- [Contributing](CONTRIBUTING.md) - How to contribute to the project
- [Changelog](https://github.com/your-username/TimeLock/blob/main/CHANGELOG.md) - Version history and changes

## 🎯 Recent Updates

### v1.0.0 (Current)
- ✅ Complete style refactoring - organized styles into dedicated files
- ✅ Calendar export with duplicate prevention
- ✅ Multiple calendar views (Month/Week/Agenda)
- ✅ Enhanced export messages and user feedback
- ✅ Local time handling (fixed UTC timezone issues)
- ✅ Live date/time display in calendar header
- ✅ Auto-scroll functionality in calendar and tasks views

### Key Features Implemented
- **Calendar Sync**: Bidirectional sync with device calendars
- **Selective Export**: Choose which tasks to export
- **Progress Tracking**: Visual countdown timers on task cards
- **Category System**: Color-coded task organization
- **Notification System**: Permission-based notifications
- **Theme Support**: Light/dark mode with system preference detection

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

**Made with ❤️ by TimeLock Team**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/README.md