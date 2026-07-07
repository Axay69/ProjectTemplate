# React Native Project Structure & Engineering Guidelines

Production-ready React Native template built using a **Feature-based Modular Architecture**.

The goal of this architecture is to keep the codebase:
- **Scalable**: Easy to grow the codebase with hundreds of features and components.
- **Predictable**: Clear guidelines on where code belongs.
- **Easy to Maintain**: Highly decoupled modules and robust dependency flows.
- **Onboard-friendly**: Intuitive structure that helps new developers start contributing quickly.
- **Independent**: Strong boundaries between business domains to limit regression.

---

## 1. Architecture Overview

The codebase is divided into **five main layers** of responsibility:

| Layer | Responsibility | Path | Path Alias |
| :--- | :--- | :--- | :--- |
| **app** | Application bootstrap, top-level providers, navigation navigators config | `src/app/` | `@app/*` |
| **store** | Consolidated global application state, slices, actions, selectors, and store configuration | `src/store/` | `@store/*` |
| **features** | Domain-driven business logic and feature-specific components | `src/features/` | `@features/*` |
| **shared** | Reusable UI components, style themes, assets, hooks, validators, global constants | `src/shared/` | `@shared/*` |
| **core** | Infrastructure, native utility setups, local storage, API configuration, permissions | `src/core/` | `@core/*` |
| **modules** | Standalone wrappers around third-party SDKs or native libraries | `src/modules/` | `@modules/*` |

---

## 2. Dependency Rules

Dependencies flow in **one direction only**. This unidirectional flow prevents circular dependencies and spaghetti coupling.

```
      app
       │
       ▼
    features
       │
       ▼
     shared
       │
       ▼
      core
       │
       ▼
    modules
```

### ✅ Allowed Imports
- `features` ➔ `shared`
- `features` ➔ `core`
- `shared` ➔ `core`
- `core` ➔ `modules`

### ❌ Not Allowed Imports
- **`feature A` ➔ `feature B` (Strict Feature Boundary Rule)**
- `shared` ➔ `feature`
- `core` ➔ `feature`
- `core` ➔ `shared`

> [!IMPORTANT]
> **The Feature Boundary Rule**: Sibling features must never import from each other directly. 
> - For example, `features/home` cannot import a hook or screen from `features/profile`.
> - **Exception**: Features are permitted to query the global `auth` store slice (`apiHeader`, `userInfo`) to determine session state.
> - **Solution**: If two features need the same component, service method, mapper, or helper, it **must** be promoted to `shared/` or `core/`.

---

## 3. Feature Architecture

Every feature module follows a standardized structure to keep business logic modular:

```
src/features/feature-name/
├── components/          # UI components specific to this feature
├── hooks/               # Custom React hooks specific to this feature
├── mappers/             # Transform API response payloads into presentation models
├── models/              # Business models and domain models
├── navigation/          # Navigation parameters or local feature navigators
├── screens/             # Screen container components (e.g., Login, Profile)
├── services/            # API services, handlers, and endpoints
├── types/               # TypeScript interfaces, request/response models
├── utils/               # Helper utilities specific to this feature
└── index.ts             # Feature entrypoint (barrel export)
```

---

## 4. Redux Store Architecture (`store/`)

To prevent circular dependency issues and keep state management scalable, all Redux slices, selectors, and store settings are placed in `src/store/`. 

> [!NOTE]
> We name the directory `store` rather than `redux` to avoid path conflicts in TypeScript. Due to `baseUrl: "./src"`, a directory named exactly `redux` would hijack library imports of the npm package `redux` inside `node_modules`.

```
src/store/
├── auth/                       # Auth slice files
│   ├── auth.slice.ts
│   ├── auth.selectors.ts
│   ├── auth.types.ts
│   └── index.ts
│
├── ui/                         # Global UI/loader slice files
│   ├── ui.slice.ts
│   ├── ui.selectors.ts
│   ├── ui.types.ts
│   └── index.ts
│
├── rootReducer.ts              # Combines all slices
└── index.ts                    # Configures store instance & MMKV persistence
```

---

## 5. Models vs. Types

Instead of placing all representations under `types/`, structure them clearly to separate raw DTOs (Data Transfer Objects) from domain objects:

```
API JSON
   │
   ▼
types/api.ts        <-- Raw request & response DTOs (e.g. matching backend snake_case)
   │
   ▼
mappers/            <-- Transforms API response payloads into UI domain models
   │
   ▼
models/             <-- Business/domain models (e.g. front-end camelCase with Date objects)
   │
   ▼
UI Components
```

### Example
#### `types/api.ts`
```typescript
export interface UserResponse {
  first_name: string;
  last_name: string;
  dob: string;
}
```

#### `models/User.ts`
```typescript
export interface User {
  firstName: string;
  lastName: string;
  dob: Date;
}
```

#### `mappers/user.mapper.ts`
```typescript
import { UserResponse } from '../types/api';
import { User } from '../models/User';

export const toUser = (data: UserResponse): User => ({
  firstName: data.first_name,
  lastName: data.last_name,
  dob: new Date(data.dob),
});
```

### Where to Put Models
- **Feature-Scoped**: If a model (e.g., `User`, `Booking`, `Match`) belongs to only one feature, define it locally:
  - `src/features/profile/models/User.ts`
  - `src/features/booking/models/Booking.ts`
  - `src/features/matches/models/Match.ts`
- **Shared Domains**: If multiple sibling features use the same models (e.g., `Match`, `Team`, `Player` are used across Home, Favorites, Search, and Notifications features), locate them under shared models to prevent duplication:
  - `src/shared/models/Match.ts`
  - `src/shared/models/Team.ts`

---

## 6. Shared Components Organization

To maintain visual scalability as components grow, we organize components in `src/shared/components/` into semantic categories:

```
src/shared/components/
│
├── primitives/         # Low-level primitive design tokens (Button, Text, Input, Switch)
│   ├── Button/
│   ├── Text/
│   └── Input/
│
├── composite/          # Domain-neutral components built from primitives (InputField, ProfilePicture)
│   ├── InputField/
│   └── ProfilePicture/
│
├── layout/             # Structure and layout grids (ScreenContainer, Spacer, Grid)
│   ├── ScreenContainer/
│   └── Spacer/
│
├── feedback/           # Notifications and status displays (Toast, Loader, Skeleton, ErrorBoundary)
│   ├── CustomToast/
│   └── Loaders/
│
├── overlays/           # Floating elements (Modal, BottomSheet, CustomBottomSheet)
│   ├── CustomBottomSheet/
│   └── DeleteBottomSheet/
│
├── media/              # Multimedia displays (FastImage, AudioPlayer)
│   └── FastImage/
│
└── index.ts            # Consolidates and exposes shared components
```

---

## 7. Naming Conventions

Predictable file naming helps developers find files instantly and improves indexing.

| Layer / Type | Rule / Pattern | Example |
| :--- | :--- | :--- |
| **Components** | PascalCase, named descriptively | `PrimaryButton.tsx`, `ProfilePicture.tsx` |
| **Hooks** | camelCase, prefixed with `use` | `useAuth.ts`, `useKeyboard.ts` |
| **Services** | lowercase, suffix with `.service.ts` | `auth.service.ts`, `profile.service.ts` |
| **Redux Slices** | lowercase name, suffix with `.slice.ts` | `auth.slice.ts`, `ui.slice.ts` |
| **Screens** | PascalCase, folder named by function | `Profile/index.tsx`, `EditProfile/index.tsx` |
| **Types** | lowercase category | `api.ts`, `navigation.ts`, `models.ts` |

---

## 8. Barrel Export Rules

- **Rule**: Every public folder must expose a clean entrypoint via `index.ts`.
- **Constraint**: Never import from deep directories (e.g. `@features/profile/screens/Profile/index`) if you are outside that module. Always import from the barrel index.

**Correct (Cleaner & Refactor-Safe)**:
```typescript
import { PrimaryButton, MyText } from '@shared/components';
import { ProfileScreen } from '@features/profile';
```

**Incorrect**:
```typescript
import PrimaryButton from '../../shared/components/primitives/Button';
import ProfileScreen from '../../features/profile/screens/Profile';
```

---

## 9. Do's and Don'ts Checklist

### Do ✅
- Keep screens thin. Screens should delegate business logic to custom hooks and data fetching to service layers.
- Group related features together under business subfolders.
- Use paths aliases (`@app`, `@core`, `@features`, `@shared`, `@theme`, `@constants`, `@store`) everywhere.
- Extract common layout elements (margins, safe area wrappers) into `ScreenContainer`.
- Handle network responses status codes cleanly in `core/api/interceptors.ts`.

### Don't ❌
- **Don't** write business logic inside UI primitives.
- **Don't** bypass path aliases by writing relative imports (`../../../`).
- **Don't** duplicate common configurations (like strings, colors, or base links). Share them in `@theme` and `@constants`.
- **Don't** mutate state directly; always dispatch actions through feature stores.

---

## 10. Editor & Formatting Settings

To guarantee consistent code formatting across different developers and devices, the workspace is configured to enforce **Prettier** as the default code formatter inside the editor.

### Workspace Configurations (`.vscode/settings.json`)
The [.vscode/settings.json](file:///Users/user/Desktop/Akshay/project_template/.vscode/settings.json) file automatically controls formatting behaviour:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Prettier CLI Integration
To run Prettier manually from the terminal across all supported files in the codebase, use the following package scripts:
- **Format all files**: `yarn format` (runs `prettier --write`)
- **Check formatting**: `yarn format:check` (runs `prettier --check`)

