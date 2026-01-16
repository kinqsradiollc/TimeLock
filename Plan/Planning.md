# TimeLock App Planning

## Overview
TimeLock is a deadline management app built with Expo/React Native that helps users track tasks, deadlines, and time remaining with calendar integration, notifications, and live activities.

## Core Features

### 1. Task Management ✅ IMPLEMENTED
- Create, edit, delete tasks
- Set deadlines with specific date and time
- User-created categories with custom colors
- Mark tasks as complete/incomplete
- Task list view with sorting/filtering by category, priority, deadline
- Task detail view with full information
- Form validation and error handling

### 2. Calendar Integration ✅ IMPLEMENTED
- Calendar view showing deadlines (Month/Week/Agenda views)
- Date picker for setting deadlines
- Visual indicators for upcoming/overdue tasks
- Monthly/weekly/agenda calendar views
- **One-way export to device calendar** (not bidirectional sync)
- ICS file export for tasks
- Duplicate prevention for calendar exports
- Calendar permissions management

### 3. Time Tracking ✅ IMPLEMENTED
- Countdown timers for active tasks with real-time updates (1-second intervals)
- Comprehensive time remaining calculations with urgency detection
- Visual progress indicators with circular progress rings
- Time tracking utilities with date-fns
- Urgent/critical visual feedback (flame icon for <24hrs)
- Dynamic color coding based on deadline proximity

### 4. Notifications 🔄 PARTIAL IMPLEMENTATION
- Calendar permissions implemented
- Notification permissions UI ready
- Local notifications for upcoming deadlines (not yet implemented)
- Predefined reminder options: 1 day, 2 days, 1 week, 2 weeks before deadline (planned)
- Multiple reminders per task (planned)
- Notification settings and permissions management (UI ready)

### 5. Live Activities (iOS) ❌ FUTURE
- Dynamic lock screen widgets
- Real-time countdown updates
- Task progress on Dynamic Island
- Quick actions from lock screen

### 6. Task Sharing (QR Code) 🔄 PARTIAL SETUP
- Libraries installed (react-native-qrcode-svg, expo-barcode-scanner)
- Generate QR codes for individual tasks (not implemented)
- Share tasks via QR codes containing task details (not implemented)
- Scan QR codes to import shared tasks (not implemented)
- Quick task duplication between users (not implemented)

## Technical Architecture

### Frontend
- React Native with Expo SDK 54
- TypeScript for type safety with strict mode enabled
- Expo Router for file-based navigation
- Component-based architecture with context providers
- Tab-based navigation with (tabs) route group

### Data Storage
- SQLite database via expo-sqlite with migrations
- Local data persistence with transaction support
- Structured data models with TypeScript interfaces
- Repository pattern for data access (TaskRepository, CategoryRepository, SettingsRepository)

### State Management
- React Context API for global state (ThemeProvider, TaskContext)
- Custom hooks for data fetching and theme management
- Local state with useState and useReducer

### UI/UX
- Clean, intuitive interface with consistent design patterns
- Calendar-based navigation with multiple view modes
- Shared style system with 40+ reusable patterns
- Haptic feedback for user interactions
- Light/dark/system theme support with persistence
- Organized style architecture:
  - `styles/shared.ts` - Reusable style patterns library
  - `styles/screens/` - Screen-specific styles
  - `styles/components/` - Component-specific styles
  - `styles/colors.ts` - Theme color tokens
  - `styles/spacing.ts` - Spacing constants
  - `styles/typography.ts` - Typography definitions

### Services
- CalendarSyncService for device calendar integration
- Migration system for database versioning

### Documentation
- Comprehensive documentation suite in `docs/` directory
- Branching strategy guide (BRANCHING.md)
- Code style guide (CODE_STYLE.md)
- Contributing guidelines (CONTRIBUTING.md)
- Development workflow documentation (DEVELOPMENT.md)
- Version history tracking (CHANGELOG.md)

## Development Phases

### Phase 1: Core Setup ✅ COMPLETED
- ✅ Database schema design and initialization
- ✅ Basic task CRUD operations with repository pattern
- ✅ Category management (create, edit, delete)
- ✅ Simple list view with filtering
- ✅ Date picker integration
- ✅ TypeScript setup with strict mode
- ✅ Expo Router navigation structure

### Phase 2: Calendar Features ✅ COMPLETED
- ✅ Calendar component integration (react-native-calendars)
- ✅ Deadline visualization with marked dates
- ✅ Date-based filtering
- ✅ Multiple calendar views (Month/Week/Agenda)
- ✅ Export to device calendar (one-way)
- ✅ ICS file export
- ✅ Calendar permissions management

### Phase 3: Time Tracking ❌ NOT STARTED
- Countdown timer implementation
- Time remaining calculations
- Progress tracking

### Phase 4: Notifications 🔄 IN PROGRESS
- ✅ Notification permissions UI
- ✅ Calendar permissions implemented
- ❌ Local notification setup
- ❌ Reminder scheduling
- ❌ Notification handler implementation

### Phase 5: Live Activities ❌ FUTURE
- iOS Live Activities implementation
- Dynamic updates
- Lock screen integration

### Phase 6: Advanced Features 🔄 PARTIAL
- ✅ Libraries installed for QR code sharing
- ❌ QR code task sharing implementation
- ❌ Enhanced notification features
- ❌ Task import/export functionality

### Phase 7: Polish & Testing 🔄 IN PROGRESS
- ✅ UI improvements and animations
- ✅ Style system refactoring with shared patterns
- ✅ Comprehensive documentation suite
- ✅ Git branching strategy implementation
- ✅ Theme system (light/dark/system)
- ✅ Performance optimization (reduced code duplication)
- ❌ Comprehensive testing across devices
- ❌ Accessibility features (screen reader support)
- ❌ Bug fixes and stability improvements

## File Structure
```
TimeLock/
├── app/                    # Expo Router pages
│   ├── (tabs)/             # Tab navigation group
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── index.tsx      # Home screen
│   │   ├── tasks.tsx      # Task list screen
│   │   ├── calendar.tsx   # Calendar screen
│   │   └── explore.tsx    # Explore screen
│   ├── _layout.tsx        # Root layout
│   ├── modal.tsx          # Modal screen
│   ├── task-detail.tsx    # Task detail screen
│   ├── task-form.tsx      # Task creation/edit form
│   ├── category-manager.tsx # Category management
│   ├── settings.tsx       # Settings screen
│   └── debug.tsx          # Debug utilities
├── components/            # Reusable components
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/                # UI components
├── constants/            # App constants
│   └── theme.ts          # Theme colors and tokens
├── contexts/             # React Context providers
│   ├── TaskContext.tsx   # Task state management
│   └── ThemeProvider.tsx # Theme management
├── database/             # Database configuration
│   └── migrations.ts     # Database migration system
├── hooks/                # Custom hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── repositories/         # Repository pattern for CRUD
│   ├── TaskRepository.ts
│   ├── CategoryRepository.ts
│   ├── SettingsRepository.ts
│   └── index.ts
├── services/             # Business logic services
│   ├── CalendarSyncService.ts
│   └── index.ts
├── styles/               # Style organization
│   ├── shared.ts         # 40+ reusable style patterns
│   ├── common.ts         # Common style exports
│   ├── colors.ts         # Theme color tokens
│   ├── spacing.ts        # Spacing constants
│   ├── typography.ts     # Typography definitions
│   ├── screens/          # Screen-specific styles
│   └── components/       # Component-specific styles
├── types/                # TypeScript interfaces
│   └── index.ts          # Type definitions
├── utils/                # Helper functions
├── docs/                 # Documentation suite
│   ├── README.md         # Documentation index
│   ├── BRANCHING.md      # Git branching strategy
│   ├── CODE_STYLE.md     # Code style guide
│   ├── CONTRIBUTING.md   # Contribution guidelines
│   └── DEVELOPMENT.md    # Development workflow
├── Plan/                 # Project planning
│   ├── Planning.md       # Project overview
│   ├── Checklist.md      # Development checklist
│   ├── Model.md          # Data models
│   ├── Library.md        # Dependencies
│   └── CodingRules.md    # Coding standards
├── CHANGELOG.md          # Version history
└── README.md             # Project overview
```

## Dependencies
See Library.md for detailed library information.</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/Plan/Planning.md