# Contributing Guide 🤝

Welcome to TimeLock! We're excited that you're interested in contributing to our React Native task management app. This guide will help you get started with development, understand our processes, and make meaningful contributions.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Code Review Process](#code-review-process)
- [Testing Guidelines](#testing-guidelines)
- [Reporting Issues](#reporting-issues)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm/yarn
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git** 2.30+
- **iOS Simulator** (macOS) or **Android Studio** (any OS)
- **VS Code** with recommended extensions

### Quick Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/TimeLock.git
   cd TimeLock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Development Setup

### Environment Configuration

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment**
   ```env
   EXPO_PUBLIC_API_URL=your_api_url
   EXPO_PUBLIC_ENVIRONMENT=development
   ```

### Database Setup

TimeLock uses Expo SQLite for local data storage. The database schema is automatically created on first run.

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "msjsdiag.debugger-for-chrome",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "expo.vscode-expo-tools"
  ]
}
```

## How to Contribute

### Types of Contributions

#### 🐛 Bug Fixes
- Fix reported bugs
- Improve error handling
- Fix UI/UX issues

#### ✨ New Features
- Add new functionality
- Improve existing features
- Enhance user experience

#### 📚 Documentation
- Update guides and docs
- Add code comments
- Create tutorials

#### 🧪 Testing
- Write unit tests
- Write integration tests
- Improve test coverage

#### 🎨 UI/UX Improvements
- Style improvements
- Accessibility enhancements
- Performance optimizations

### Finding Issues to Work On

1. **Check GitHub Issues**
   - Look for `good first issue` labels
   - Check `help wanted` labels
   - Review `bug` and `enhancement` issues

2. **Check Project Board**
   - Review current sprint items
   - Look at backlog items

3. **Self-Identify Improvements**
   - Code refactoring opportunities
   - Performance improvements
   - UI/UX enhancements

## Development Workflow

### 1. Choose an Issue

```bash
# Find an issue to work on
# Create a branch for your work
git checkout -b feature/add-calendar-export
```

### 2. Development Process

#### Code Changes
```bash
# Make your changes
# Test thoroughly
# Run linting
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

#### Commit Guidelines
```bash
# Use conventional commits
git commit -m "feat: add calendar export functionality

- Implement selective task export
- Add duplicate prevention
- Update UI with export options"

# Or for fixes
git commit -m "fix: resolve timezone display issue

- Fix UTC to local time conversion
- Update calendar header display"
```

### 3. Testing Your Changes

#### Manual Testing Checklist
- [ ] Test on iOS Simulator
- [ ] Test on Android Emulator
- [ ] Test on physical device (if possible)
- [ ] Test different screen sizes
- [ ] Test dark/light mode
- [ ] Test accessibility features

#### Automated Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests (if available)
npm run test:e2e
```

### 4. Create Pull Request

#### Before Creating PR
```bash
# Ensure branch is up to date
git fetch origin
git rebase origin/main

# Run full test suite
npm run ci

# Push your changes
git push origin feature/your-feature
```

#### PR Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console errors
```

## Code Review Process

### Review Checklist

#### For Reviewers
- [ ] **Code Quality**: Follows our style guide
- [ ] **Functionality**: Works as expected
- [ ] **Performance**: No performance regressions
- [ ] **Security**: No security vulnerabilities
- [ ] **Testing**: Adequate test coverage
- [ ] **Documentation**: Code is well-documented

#### For Contributors
- [ ] **Self-Review**: Review your own code first
- [ ] **Edge Cases**: Handle error conditions
- [ ] **Performance**: Consider performance implications
- [ ] **Accessibility**: Follow accessibility guidelines
- [ ] **Mobile-First**: Test on multiple devices

### Review Comments

#### Constructive Feedback
```markdown
✅ **Good**: "Consider using memo() here to prevent unnecessary re-renders"

❌ **Bad**: "This is wrong"
```

#### Requesting Changes
- Be specific about what needs to change
- Explain why the change is needed
- Suggest alternatives if appropriate

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback

- Add memoization to TaskCard component
- Improve error handling in calendar sync"

# Push updated changes
git push origin feature/your-feature
```

## Testing Guidelines

### Unit Testing

#### Test File Structure
```
__tests__/
├── components/
│   ├── TaskCard.test.tsx
│   └── PageHeader.test.tsx
├── hooks/
│   └── use-tasks.test.ts
└── utils/
    └── date-utils.test.ts
```

#### Example Test
```typescript
// __tests__/components/TaskCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '@/components/TaskCard';

describe('TaskCard', () => {
  it('renders task title correctly', () => {
    const { getByText } = render(
      <TaskCard
        title="Test Task"
        completed={false}
        onPress={() => {}}
      />
    );

    expect(getByText('Test Task')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <TaskCard
        title="Test Task"
        completed={false}
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByText('Test Task'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

#### API Integration Tests
```typescript
describe('Task API', () => {
  it('creates a new task', async () => {
    const taskData = { title: 'New Task' };
    const response = await createTask(taskData);

    expect(response.id).toBeDefined();
    expect(response.title).toBe(taskData.title);
  });
});
```

### E2E Testing

#### Detox Setup (Recommended)
```typescript
describe('Task Creation Flow', () => {
  it('should create a new task', async () => {
    await device.launchApp();

    await element(by.id('add-task-button')).tap();
    await element(by.id('task-title-input')).typeText('New Task');
    await element(by.id('submit-button')).tap();

    await expect(element(by.text('New Task'))).toBeVisible();
  });
});
```

## Reporting Issues

### Bug Reports

#### Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- Device: [e.g. iPhone 12]
- OS: [e.g. iOS 15.5]
- App Version: [e.g. 1.0.0]
- Expo SDK: [e.g. 49]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

#### Template
```markdown
**Is your feature request related to a problem? Please describe.**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Pull Request Guidelines

### PR Title Format
```
type(scope): description
```

#### Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Testing
- `chore:` - Maintenance

#### Examples
```
feat: add calendar export functionality
fix: resolve timezone display issue
docs: update contribution guidelines
style: format code with prettier
refactor: extract calendar sync service
test: add task creation tests
```

### PR Description Requirements

#### Required Sections
- **Description**: What changes were made and why
- **Type of Change**: Categorize the change
- **Testing**: How the changes were tested
- **Breaking Changes**: If any APIs changed

#### Optional Sections
- **Screenshots**: For UI changes
- **Performance Impact**: If applicable
- **Security Considerations**: If applicable

### Branch Requirements

#### Branch Naming
```bash
# Feature branches
feature/add-calendar-export
fix/timezone-bug
docs/update-readme

# Never commit directly to main
```

#### Branch Status
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] All tests pass
- [ ] Code is formatted and linted

## Community Guidelines

### Code of Conduct

#### Be Respectful
- Use inclusive language
- Respect different viewpoints
- Be constructive with feedback
- Help newcomers learn

#### Communication
- Keep discussions on topic
- Use clear, concise language
- Provide context for questions
- Be patient with responses

### Getting Help

#### Where to Ask Questions
1. **GitHub Issues**: For bugs and feature requests
2. **GitHub Discussions**: For general questions
3. **Discord/Slack**: For real-time chat (if available)

#### How to Ask Good Questions
```markdown
❌ Bad: "It doesn't work"

✅ Good: "I'm getting an error when trying to create a task. Here's what I did:
1. Opened the app
2. Tapped the add button
3. Entered 'Test Task' as title
4. Tapped save

Expected: Task should be created
Actual: App crashes with error: 'Cannot read property 'id' of undefined'

Environment: iOS 15.5, Expo SDK 49"
```

### Recognition

#### Contributors
- All contributors will be recognized in CHANGELOG.md
- Significant contributors may be added to a future contributors file
- Regular contributors may be invited to join the core team

#### Attribution
- Code contributions will be attributed to the author
- Design contributions will be credited appropriately
- Documentation improvements will be acknowledged

## Development Commands

### Essential Scripts
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Build for production
npm run build
```

### Advanced Scripts
```bash
# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

# Pre-commit checks
npm run pre-commit

# Clean install
npm run clean-install
```

---

## 📚 Quick Reference

### First Time Setup
```bash
git clone https://github.com/your-username/TimeLock.git
cd TimeLock
npm install
cp .env.example .env
npx expo start
```

### Daily Development
```bash
git checkout -b feature/my-feature
# Make changes
npm run lint && npm test
git add . && git commit -m "feat: my feature"
git push origin feature/my-feature
# Create PR
```

### Before Committing
```bash
npm run type-check
npm run lint
npm test
npm run format
```

---

**Thank you for contributing to TimeLock! Your efforts help make task management better for everyone. 🚀**</content>
<parameter name="filePath">/Users/anhdang/Documents/Github/TimeLock/docs/CONTRIBUTING.md