# TimeLock App Planning

## Overview
TimeLock is a deadline management app built with Expo/React Native that helps users track tasks, deadlines, and time remaining with calendar integration, notifications, and live activities.

## Core Features

### 1. Task Management
- Create, edit, delete tasks
- Set deadlines with specific date and time
- User-created categories with custom colors
- Mark tasks as complete/incomplete
- Task list view with sorting/filtering by category, priority, deadline

### 2. Calendar Integration
- Calendar view showing deadlines
- Date picker for setting deadlines
- Visual indicators for upcoming/overdue tasks
- Monthly/weekly/daily calendar views

### 3. Time Tracking
- Countdown timers for active tasks
- Time remaining calculations
- Visual progress indicators
- Time tracking for task completion

### 4. Notifications
- Local notifications for upcoming deadlines
- Predefined reminder options: 1 day, 2 days, 1 week, 2 weeks before deadline
- Multiple reminders per task
- Notification settings and permissions management

### 5. Live Activities (iOS)
- Dynamic lock screen widgets
- Real-time countdown updates
- Task progress on Dynamic Island
- Quick actions from lock screen

### 6. Task Sharing (QR Code)
- Generate QR codes for individual tasks
- Share tasks via QR codes containing task details
- Scan QR codes to import shared tasks
- Quick task duplication between users

## Technical Architecture

### Frontend
- React Native with Expo
- TypeScript for type safety
- Expo Router for navigation
- Component-based architecture

### Data Storage
- SQLite database via expo-sqlite
- Local data persistence
- Structured data models

### UI/UX
- Clean, intuitive interface
- Calendar-based navigation
- Animated countdown timers
- Haptic feedback
 - Light/dark theme support and user theme setting (light/dark/system)

## Development Phases

### Phase 1: Core Setup
- Database schema design and initialization
- Basic task CRUD operations
- Category management (create, edit, delete)
- Simple list view
- Date picker integration

### Phase 2: Calendar Features
- Calendar component integration
- Deadline visualization
- Date-based filtering

### Phase 3: Time Tracking
- Countdown timer implementation
- Time remaining calculations
- Progress tracking

### Phase 4: Notifications
- Local notification setup
- Reminder scheduling
- Notification permissions

### Phase 5: Live Activities
- iOS Live Activities implementation
- Dynamic updates
- Lock screen integration

### Phase 6: Advanced Features
- QR code task sharing implementation
- Enhanced notification features
- Task import/export functionality

### Phase 7: Polish & Testing
- UI improvements and animations
- Performance optimization
- Comprehensive testing across devices
- Bug fixes and stability improvements

## File Structure
```
TimeLock/
├── app/                    # Expo Router pages
├── components/            # Reusable components
├── constants/            # App constants and predefined values
├── hooks/                # Custom hooks
├── database/             # Database schema and connection
├── repositories/         # Repository pattern for CRUD operations
├── types/                # TypeScript interfaces and types
├── utils/                # Helper functions
└── services/             # Notification and other services
```

## Dependencies
See Library.md for detailed library information.</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/Plan/Planning.md