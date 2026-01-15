# TimeLock Coding Rules

This document defines the coding standards and rules for the TimeLock project. Follow these guidelines to keep the codebase consistent, maintainable, and safe.

## 1. Languages & Style
- Use **TypeScript** for all application code. Avoid using `any` unless absolutely necessary and justified in a comment.
- Prefer explicit types for public interfaces and exported functions.
- Use modern ECMAScript features supported by the project's toolchain.

## 2. Formatting & Linting
- Use **Prettier** for code formatting. Project should include a `.prettierrc` with agreed settings.
- Use **ESLint** with the `eslint-config-expo` baseline and TypeScript support. Fix lint issues before merging.
- Run `npm run lint` (or project equivalent) in CI and locally before opening PRs.

## 3. File & Folder Structure
- Follow the project structure in `Plan/Planning.md`.
- Keep files small (prefer < 300 LOC). If a component grows larger, split it into smaller components.
- Place UI components under `components/`, screens under `app/`, data layer under `database/` and `repositories/`, types under `types/`, and platform-specific code in clear subfolders.

## 4. React & React Native Practices
- Use functional components and hooks only. Do not use class components.
- Keep components pure where possible; side effects should be in hooks (e.g., `useEffect`) or services.
- Prefer composition over prop drilling; use context for truly global state.
- Avoid heavy work on the UI thread; use animations and worklets (`react-native-reanimated`) appropriately.

## 5. State Management
- Use React Context for simple global state (theme, auth). For complex state, prefer a lightweight library (e.g., Zustand) and keep it out of components.
- Keep repository access in services/repositories, not in UI components.

## 6. Data Layer & Repositories
- Implement a repository pattern (`repositories/`) to encapsulate CRUD and SQL logic.
- Repositories should return plain JavaScript objects typed via TypeScript interfaces in `types/`.
- Validate inputs at repository boundaries; do not trust external sources.
- Use parameterized queries for SQLite to prevent injection-like issues.

## 7. Database Migrations & Seeding
- Include a simple migration strategy for SQLite (versioned migrations run on startup).
- Provide a seeding mechanism for dev environment to populate sample data.

## 8. Notifications & Permissions
- Centralize notification scheduling in a `services/notification` module.
- Always request permissions from the user with clear rationale before scheduling.
- Do not store or transmit sensitive user data in notifications or QR codes.

## 9. Theming & Styles
- Use a centralized theme file (`constants/theme.ts`) exporting color tokens for `light` and `dark` modes.
- Components must read colors from theme tokens (do not hardcode hex values in components).
- Support `system` theme mode and a persisted user preference.

## 10. Accessibility
- All interactive elements must be accessible: set `accessibilityLabel`, `accessibilityRole`, and use accessible touch targets.
- Ensure color contrast meets WCAG AA for primary UI text.

## 11. Performance
- Memoize expensive calculations with `useMemo` and stable callbacks with `useCallback` as needed.
- Use `FlatList` and other virtualized lists for long lists; provide `keyExtractor` and `getItemLayout` when possible.
- Avoid anonymous functions in frequently rendered children when possible.

## 12. Testing
- Unit test repositories and utility functions with Jest.
- Use React Native Testing Library for component tests.
- Add integration tests for key flows where practical.

## 13. Security & Privacy
- Do not log sensitive data (tokens, personal info) to the console in production.
- Store secrets out of the repository (use environment variables and secure stores when needed).
- QR codes must not contain personally identifying information; only task details as specified in `Plan/Model.md`.

## 14. Dependency Management
- Keep dependencies up-to-date and avoid unnecessary packages.
- Review new dependencies for bloat and license compatibility.
- Use `npm audit` in CI and address high/critical findings.

## 15. Git & PR Workflow
- Use feature branches named `feat/<short-description>` or `fix/<short-description>`.
- Write clear PR descriptions and reference related issues.
- Run lint and tests locally before opening a PR. CI must run lint and tests.
- Require at least one code review approval before merging to main.

## 16. Commit Messages
- Use conventional commits style: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Keep messages concise; include rationale in the PR description.

## 17. Documentation
- Update `README.md` with setup, run, and build instructions.
- Document repository APIs in `Plan/Model.md` and provide usage examples.

## 18. CI / CD
- CI should run `npm ci`, `npm run lint`, `npm test`.
- Use EAS or appropriate build tooling for production builds.

## 19. Mobile Platform Notes
- Test on both iOS and Android devices/emulators regularly.
- Consider platform differences (permissions, icons, live activities) in design and code.

## 20. Non-Blocking Rules & Exceptions
- If a rule must be broken, document the exception in the PR and get reviewer approval.

---

Follow these rules to keep TimeLock consistent and maintainable. If you'd like, I can convert this into an automatic pre-commit hook (lint + format) and CI job next.

## Design Principles

Apply these high-level coding principles across the codebase; they guide decisions at the file, module and architecture level.

- **DRY (Don't Repeat Yourself)**: extract reusable logic into utilities, hooks, or services to avoid duplicate code and reduce bugs.
- **KISS (Keep It Simple, Stupid)**: prefer simple, readable solutions over clever optimizations. Complexity costs maintenance time.
- **YAGNI (You Aren't Gonna Need It)**: avoid adding features or abstractions "just in case"; implement complexity when a real need appears.
- **SOLID / OOP Principles** (applied pragmatically in TS):
	- Single Responsibility Principle (SRP): modules and classes should have one reason to change.
	- Open/Closed Principle: extend behavior with composition or small adapters instead of modifying existing code.
	- Liskov Substitution and Interface Segregation: prefer small, focused interfaces and predictable substitutions.
	- Dependency Inversion: depend on abstractions (interfaces) rather than concrete implementations, e.g., repositories/services.
- **Composition over Inheritance**: favor composing small components/hooks over deep inheritance hierarchies in React.
- **Separation of Concerns**: UI, business logic, data access, and side effects should live in separate modules (`components/`, `services/`, `repositories/`).
- **Small Functions & Modules**: functions should do one thing and be easy to test; modules should group related responsibilities.
- **Prefer Immutability**: keep state updates predictable; favor immutable patterns for reducers and data transformations.
- **Fail Fast & Explicit Errors**: validate inputs early and throw or return explicit errors rather than silently failing.
- **Law of Demeter (Loose Coupling)**: a module should only talk to its immediate collaborators — avoid reaching into deep object graphs.
- **Meaningful Names**: choose clear, descriptive names for variables, functions and modules that convey intent.
- **Testability First**: design code to be testable — prefer small pure functions and injectable dependencies.

Practical examples for this project:
- Put SQL queries and data mapping in `repositories/` (SRP + testability).
- Keep presentation logic in components and move side effects to hooks or `services/` (Separation of Concerns).
- Use a `constants/theme.ts` for colors to avoid duplicated hardcoded values (DRY).
- Expose repository interfaces and inject concrete implementations in higher-level services (Dependency Inversion).
