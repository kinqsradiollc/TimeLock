# TimeLock Data Models

This document defines the data structures and database schema for the TimeLock app.

## Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT 0,
  priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  category_id INTEGER,
  notifications TEXT, -- JSON array of predefined notification times in minutes before deadline
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT, -- hex color code
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Settings Table
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Predefined Notification Options

```typescript
const NOTIFICATION_OPTIONS = {
  ONE_MINUTE: 1,
  FIVE_MINUTES: 5,
  FIFTEEN_MINUTES: 15,
  THIRTY_MINUTES: 30,
  ONE_HOUR: 60,
  TWO_HOURS: 120,
  ONE_DAY: 1440,
  TWO_DAYS: 2880,
  ONE_WEEK: 10080,
  TWO_WEEKS: 20160,
} as const;

type NotificationOption = typeof NOTIFICATION_OPTIONS[keyof typeof NOTIFICATION_OPTIONS];
```

Users can only select from these predefined notification times. The `notifications` field in tasks will store an array of these values (e.g., `[1440, 2880]` for 1 day and 2 days before deadline).

### Task Interface
```typescript
interface Task {
  id?: number;
  title: string;
  description?: string;
  deadline: string; // ISO string (includes date and time)
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  categoryId?: number; // References categories table
  notifications: NotificationOption[]; // Array of predefined notification times
  isActive: boolean;
}
```

### Category Interface
```typescript
interface Category {
  id?: number;
  name: string;
  color?: string;
  createdAt: string; // ISO string
}
```

### App Settings Interface
```typescript
interface AppSettings {
  notificationsEnabled: boolean;
  defaultNotifications: NotificationOption[]; // Default notification times for new tasks
  theme: 'light' | 'dark' | 'system';
  calendarView: 'month' | 'week' | 'day';
}
```

## Theme Management

The app supports three theme modes: `light`, `dark`, and `system`.

- **Storage**: the selected theme is persisted in the `settings` table under the key `theme` as a string value (`'light' | 'dark' | 'system'`).
- **Default**: when no value is present, the default is `'system'`.
- **Behavior**:
  - `'light'`: app always uses the light theme.
  - `'dark'`: app always uses the dark theme.
  - `'system'`: app follows the device's appearance setting; UI should observe system theme changes when possible.

Example SQL to set default theme on first run:
```sql
INSERT OR REPLACE INTO settings (key, value) VALUES ('theme', 'system');
```

TypeScript convenience types:
```typescript
type ThemeOption = 'light' | 'dark' | 'system';
```

Guidance for `SettingsRepository` implementations:
- `getAppSettings()` should read the `theme` key and coerce it into `ThemeOption`, falling back to `'system'`.
- `updateAppSettings()` should persist the `theme` string to the `settings` table when provided.

## Repository Pattern

The app uses a repository pattern to abstract data access operations. Each entity has its own repository class:

### TaskRepository
- `create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>`
- `findAll(filter?: TaskFilter): Promise<Task[]>`
- `findById(id: number): Promise<Task | null>`
- `update(id: number, updates: Partial<Task>): Promise<void>`
- `delete(id: number): Promise<void>`
- `toggleCompletion(id: number): Promise<void>`

### CategoryRepository
- `create(category: Omit<Category, 'id' | 'createdAt'>): Promise<number>`
- `findAll(): Promise<Category[]>`
- `update(id: number, updates: Partial<Category>): Promise<void>`
- `delete(id: number): Promise<void>`

### SettingsRepository
- `get(key: string): Promise<string | null>`
- `set(key: string, value: string): Promise<void>`
- `getAppSettings(): Promise<AppSettings>`
- `updateAppSettings(settings: Partial<AppSettings>): Promise<void>`

## Data Validation

### Task Validation Rules
- Title: Required, 1-100 characters
- Description: Optional, max 500 characters
- Deadline: ISO string with date and time (e.g., '2026-01-20T15:30:00.000Z')
- Priority: Must be one of allowed values
- CategoryId: Optional, must reference existing category if provided
- Notifications: Array of predefined notification options, max 4 notifications per task
- IsActive: Boolean

### Notification Options
Users can choose from these predefined options only:
- 1 minute before (1 minute)
- 5 minutes before (5 minutes)
- 15 minutes before (15 minutes)
- 30 minutes before (30 minutes)
- 1 hour before (60 minutes)
- 2 hours before (120 minutes)
- 1 day before (1440 minutes)
- 2 days before (2880 minutes)
- 1 week before (10080 minutes)
- 2 weeks before (20160 minutes)

Users can select multiple options per task.

### Category Validation Rules
- Name: Required, unique, 1-50 characters
- Color: Optional hex color code
- Categories are user-created and can be managed (create, edit, delete) by users

## QR Code Task Sharing

### QR Code Data Structure
When sharing tasks via QR code, the following data is encoded (JSON format):

```typescript
interface TaskShareData {
  version: string; // For future compatibility
  title: string;
  description?: string;
  deadline: string; // ISO string with date and time
  priority: 'low' | 'medium' | 'high' | 'urgent';
  categoryName?: string; // Category name, not ID (for cross-user compatibility)
  notifications: NotificationOption[]; // Array of notification times
  sharedBy?: string; // Optional identifier of sharer
  timestamp: string; // When the QR was generated
}
```

### Security Considerations
- QR codes contain only task details, no user-specific data
- No sensitive information is shared
- Users can review task details before importing
- Category names are shared instead of IDs for cross-user compatibility</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/Plan/Model.md