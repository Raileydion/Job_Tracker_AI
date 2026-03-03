# Project Structure Documentation

## Overview
This document outlines the reorganized folder structure for the Job Tracker AI project.

## Folder Structure

```
job-tracker-ai/
├── app/
│   ├── api/
│   │   └── ai/
│   │       └── analyze/
│   │           └── route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard - Main Hub)
│   │   ├── jobs/
│   │   │   └── page.tsx (Jobs Listing & Management)
│   │   ├── analytics/
│   │   │   └── page.tsx (Analytics & Insights)
│   │   └── settings/
│   │       └── page.tsx (User Settings)
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── DashboardSidebar.tsx (Shared sidebar for all dashboard pages)
│   │   └── DashboardTopbar.tsx (Shared topbar for all dashboard pages)
│   ├── shared/
│   │   └── UI.tsx (Reusable UI components: LoadSpinner, Avatar)
│   └── ui/
│       └── forms/
│           └── layout/
│
├── lib/
│   ├── theme.ts (Theme colors and utilities)
│   ├── gemini.ts (AI integration)
│   ├── supabase.ts (Database client)
│   ├── utils.ts (Utility functions)
│   └── constants/
│
├── types/
│   └── index.ts (TypeScript type definitions: Job, Status, ThemeColors)
│
├── hooks/
│
├── public/
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.local
```

## Key Components & Their Purpose

### Layout Components
- **DashboardSidebar.tsx**: Shared sidebar with navigation, pipeline stats, and user info
- **DashboardTopbar.tsx**: Shared topbar with page title, theme toggle, and optional add button

### Shared UI Components
- **LoadSpinner**: Animated loading spinner
- **Avatar**: Generates colored avatar initials from company/user names

### Pages
- **dashboard/page.tsx**: Main dashboard hub with job summary stats and add/edit modal
- **dashboard/jobs/page.tsx**: Browse all jobs with search, filtering, and sorting
- **dashboard/analytics/page.tsx**: Analytics dashboard with conversion metrics and funnels
- **dashboard/settings/page.tsx**: User account and profile settings

### Type Definitions
Located in `types/index.ts`:
- `Job`: Complete job application data type
- `Status`: Union type for job statuses
- `ThemeColors`: Theme color palette type

## Recent Changes

### Refactoring
1. Extracted DashboardSidebar and DashboardTopbar into reusable components
2. Created shared UI component library (LoadSpinner, Avatar)
3. Centralized theme constants and utilities
4. Added TypeScript type definitions

### All dashboard pages now include:
- Consistent sidebar with navigation and pipeline overview
- Consistent topbar with page title and controls
- Theme switching functionality
- Proper user session management
- Mobile-responsive design

## Navigation Flow

All dashboard pages are connected through:
- **Sidebar Navigation**: Dashboard → Jobs → Analytics → Settings
- **Pipeline Stats**: Real-time job status counts in sidebar
- **User Menu**: Email display and logout button in sidebar

## Theme System

Located in `lib/theme.ts`:
- `getThemeColors(dark: boolean)`: Returns complete color palette based on dark mode
- Supports light and dark themes
- Colors applied consistently across all pages

## Common Patterns

### Using DashboardSidebar:
```tsx
<DashboardSidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  userEmail={userEmail}
  jobs={jobs}
  dark={dark}
  gold={theme.gold}
  // ... other color props
  onLogout={handleLogout}
/>
```

### Using DashboardTopbar:
```tsx
<DashboardTopbar
  title="Page Title"
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  dark={dark}
  setDark={setDark}
  bgGlass={bgGlass}
  // ... other color props
  onAddClick={optionalHandler}
/>
```

## Best Practices

1. **Color Management**: Always use theme colors instead of hardcoding values
2. **Component Reuse**: Use LoadSpinner and Avatar from shared/UI.tsx
3. **Type Safety**: Import types from types/index.ts for consistency
4. **Responsive Design**: Sidebar is mobile-aware with overlay and hamburger menu
5. **State Management**: Each page manages its own state with user session checks

## Future Improvements

- Extract individual stat cards into components
- Create custom hooks for data fetching
- Add more granular component breakdowns
- Implement global state management if needed
