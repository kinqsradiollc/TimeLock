# Code Style Guide 🎨

This guide outlines the coding standards, organization patterns, and best practices for the TimeLock React Native project. Consistent code style ensures maintainability, readability, and collaboration efficiency.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [TypeScript Guidelines](#typescript-guidelines)
- [React Native Patterns](#react-native-patterns)
- [Styling Organization](#styling-organization)
- [Import/Export Patterns](#importexport-patterns)
- [Code Formatting](#code-formatting)
- [Best Practices](#best-practices)
- [Linting & Validation](#linting--validation)

## Project Structure

### Directory Layout

```
TimeLock/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   ├── modal.tsx          # Modal screens
│   └── (tabs)/            # Tab navigation
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   └── *.tsx             # Feature components
├── constants/            # App constants
├── hooks/                # Custom React hooks
├── styles/               # Style definitions
│   ├── components/       # Component styles
│   ├── screens/          # Screen styles
│   └── constants/        # Style constants
├── assets/               # Static assets
├── scripts/              # Build/utility scripts
└── docs/                 # Documentation
```

### File Naming

#### Components
- **PascalCase** for component files: `TaskCard.tsx`, `PageHeader.tsx`
- **kebab-case** for directories: `page-header/`, `task-card/`
- **Index files** for clean imports: `components/index.ts`

#### Styles
- **kebab-case** with `.styles.ts` extension: `task-card.styles.ts`
- **Component name** matches: `TaskCard.tsx` → `task-card.styles.ts`

#### Other Files
- **camelCase** for utilities: `dateUtils.ts`, `calendarSync.ts`
- **PascalCase** for types: `TaskTypes.ts`, `CalendarTypes.ts`

## File Organization

### Component Structure

#### Single File Components
```typescript
// components/TaskCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { taskCardStyles } from '@/styles/components/task-card.styles';

interface TaskCardProps {
  title: string;
  completed: boolean;
  onPress: () => void;
}

export function TaskCard({ title, completed, onPress }: TaskCardProps) {
  const colors = useThemeColor();

  return (
    <TouchableOpacity
      style={[taskCardStyles.container, { borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={taskCardStyles.content}>
        <Text style={[taskCardStyles.title, { color: colors.text }]}>
          {title}
        </Text>
        {completed && (
          <Text style={[taskCardStyles.completed, { color: colors.success }]}>
            ✓
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
```

#### Multi-File Components
```
components/TaskCard/
├── index.ts              # Main export
├── TaskCard.tsx          # Component implementation
├── TaskCard.styles.ts    # Component styles
└── TaskCard.types.ts     # Component types
```

### Screen Organization

#### Screen Structure
```typescript
// app/(tabs)/tasks.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/hooks/use-tasks';
import { tasksStyles } from '@/styles/screens/tasks.styles';

export default function TasksScreen() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={tasksStyles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            completed={item.completed}
            onPress={() => handleTaskPress(item)}
          />
        )}
        style={tasksStyles.list}
      />
    </View>
  );
}
```

## Naming Conventions

### Variables and Functions

#### camelCase
```typescript
// ✅ Good
const userName = 'John';
const getUserData = () => {};
const handleSubmit = () => {};

// ❌ Bad
const UserName = 'John';
const get_user_data = () => {};
const HandleSubmit = () => {};
```

### Components and Types

#### PascalCase
```typescript
// ✅ Good
interface TaskItem {
  id: string;
  title: string;
}

function TaskCard() {
  return <View />;
}

type TaskStatus = 'pending' | 'completed';

// ❌ Bad
interface taskItem {
  id: string;
  title: string;
}

function taskCard() {
  return <View />;
}
```

### Constants

#### UPPER_SNAKE_CASE
```typescript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// ❌ Bad
const maxRetryAttempts = 3;
const apiBaseUrl = 'https://api.example.com';
```

### Files and Directories

#### kebab-case for files
```typescript
// ✅ Good
task-card.tsx
calendar-sync.ts
date-utils.ts

// ❌ Bad
TaskCard.tsx
calendarSync.ts
date_utils.ts
```

## TypeScript Guidelines

### Type Definitions

#### Interface vs Type
```typescript
// Use interface for object shapes
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Use type for unions and primitives
type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskId = string;
```

#### Generic Components
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
```

### Type Assertions

#### Avoid `any`
```typescript
// ✅ Good
interface ApiResponse {
  data: Task[];
  total: number;
}

const response = await fetchTasks();
const tasks: Task[] = response.data;

// ❌ Bad
const response = await fetchTasks() as any;
const tasks = response.data as any;
```

#### Type Guards
```typescript
function isTask(obj: unknown): obj is Task {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    typeof (obj as Task).id === 'string'
  );
}
```

## React Native Patterns

### Hooks Usage

#### Custom Hooks
```typescript
// hooks/use-tasks.ts
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    const newTask = await taskService.create({ title });
    setTasks(prev => [...prev, newTask]);
  };

  return { tasks, loading, addTask };
}
```

#### Effect Dependencies
```typescript
// ✅ Good
useEffect(() => {
  if (userId) {
    loadUserTasks(userId);
  }
}, [userId]); // Include all dependencies

// ❌ Bad
useEffect(() => {
  loadUserTasks(userId);
}, []); // Missing dependency

useEffect(() => {
  loadUserTasks(userId);
}, [userId, tasks]); // Unnecessary dependency
```

### Component Patterns

#### Function Components with Hooks
```typescript
function TaskForm() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createTask({ title });
      setTitle('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />
      <Button
        title={loading ? 'Creating...' : 'Create Task'}
        onPress={handleSubmit}
        disabled={loading || !title.trim()}
      />
    </View>
  );
}
```

#### Conditional Rendering
```typescript
// ✅ Good
function TaskList({ tasks, loading }) {
  if (loading) {
    return <ActivityIndicator />;
  }

  if (tasks.length === 0) {
    return <EmptyState message="No tasks found" />;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}

// ❌ Bad
function TaskList({ tasks, loading }) {
  return (
    <View>
      {loading && <ActivityIndicator />}
      {!loading && tasks.length === 0 && <EmptyState />}
      {!loading && tasks.length > 0 && (
        <FlatList data={tasks} renderItem={...} />
      )}
    </View>
  );
}
```

## Styling Organization

### Style File Structure

#### Component Styles
```typescript
// styles/components/task-card.styles.ts
import { StyleSheet } from 'react-native';

export const taskCardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  completed: {
    fontSize: 18,
    color: '#4CAF50',
  },
});
```

#### Screen Styles
```typescript
// styles/screens/tasks.styles.ts
import { StyleSheet } from 'react-native';

export const tasksStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
```

### Style Constants

#### Colors
```typescript
// styles/constants/colors.ts
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: {
    primary: '#1C1C1E',
    secondary: '#3C3C43',
    disabled: '#C7C7CC',
  },
} as const;
```

#### Spacing
```typescript
// styles/constants/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
```

#### Typography
```typescript
// styles/constants/typography.ts
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
} as const;
```

## Import/Export Patterns

### Absolute Imports
```typescript
// ✅ Good - Use absolute imports with @ alias
import { TaskCard } from '@/components/TaskCard';
import { tasksStyles } from '@/styles/screens/tasks.styles';
import { useTasks } from '@/hooks/use-tasks';

// ❌ Bad - Relative imports
import { TaskCard } from '../../../components/TaskCard';
import { tasksStyles } from '../../styles/screens/tasks.styles';
```

### Barrel Exports
```typescript
// components/index.ts
export { TaskCard } from './TaskCard';
export { PageHeader } from './PageHeader';
export { EmptyState } from './EmptyState';

// Usage
import { TaskCard, PageHeader, EmptyState } from '@/components';
```

### Type Imports
```typescript
// ✅ Good - Separate type imports
import type { Task, TaskStatus } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';

// ❌ Bad - Mixed imports
import { TaskCard, type Task, type TaskStatus } from '@/components';
```

## Code Formatting

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### ESLint Configuration
```javascript
// eslint.config.js
import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: ['expo', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
});
```

### Editor Configuration
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Best Practices

### Performance

#### Memoization
```typescript
// ✅ Good
const TaskCard = memo(function TaskCard({ task, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(task.id)}>
      <Text>{task.title}</Text>
    </TouchableOpacity>
  );
});

// ❌ Bad
function TaskCard({ task, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(task.id)}>
      <Text>{task.title}</Text>
    </TouchableOpacity>
  );
}
```

#### Key Extraction
```typescript
// ✅ Good
<FlatList
  data={tasks}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <TaskItem task={item} />}
/>

// ❌ Bad
<FlatList
  data={tasks}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => <TaskItem task={item} />}
/>
```

### Error Handling

#### Async Operations
```typescript
// ✅ Good
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const loadTasks = async () => {
  setLoading(true);
  setError(null);
  try {
    const tasks = await taskService.getAll();
    setTasks(tasks);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load tasks');
  } finally {
    setLoading(false);
  }
};

// ❌ Bad
const loadTasks = async () => {
  const tasks = await taskService.getAll();
  setTasks(tasks);
};
```

### Accessibility

#### Screen Reader Support
```typescript
// ✅ Good
<TouchableOpacity
  accessibilityLabel="Create new task"
  accessibilityHint="Opens task creation form"
  accessibilityRole="button"
>
  <Text>Add Task</Text>
</TouchableOpacity>

// ❌ Bad
<TouchableOpacity>
  <Text>Add Task</Text>
</TouchableOpacity>
```

## Linting & Validation

### ESLint Rules

#### Critical Rules (Error)
```javascript
{
  "no-console": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "error"
}
```

#### Warning Rules
```javascript
{
  "@typescript-eslint/no-unused-vars": "warn",
  "react/jsx-key": "warn",
  "no-debugger": "warn"
}
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Pre-commit Hooks

#### Husky Setup
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### lint-staged Configuration
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 📚 Quick Reference

### File Templates

#### New Component
```typescript
// components/NewComponent.tsx
import React from 'react';
import { View } from 'react-native';
import { newComponentStyles } from '@/styles/components/new-component.styles';

interface NewComponentProps {
  // props
}

export function NewComponent({}: NewComponentProps) {
  return (
    <View style={newComponentStyles.container}>
      {/* content */}
    </View>
  );
}
```

#### New Screen
```typescript
// app/new-screen.tsx
import React from 'react';
import { View } from 'react-native';
import { newScreenStyles } from '@/styles/screens/new-screen.styles';

export default function NewScreen() {
  return (
    <View style={newScreenStyles.container}>
      {/* content */}
    </View>
  );
}
```

### Code Snippets

#### Custom Hook Template
```typescript
import { useState, useEffect } from 'react';

export function useCustomHook(param: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // effect logic
  }, [param]);

  return { data, loading };
}
```

#### Error Boundary
```typescript
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

**Remember: Consistent code = happy developers! 😊**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/docs/CODE_STYLE.md